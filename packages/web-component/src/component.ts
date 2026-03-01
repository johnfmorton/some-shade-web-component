import { LitElement, html, css, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createWebGLContext } from './gl/context.js';
import { createProgram, setUniforms, type ProgramInfo } from './gl/program.js';
import { loadTexture, type TextureInfo } from './gl/texture.js';
import { createQuad, drawQuad } from './gl/quad.js';
import { get as getEffect } from './registry.js';
import type { EffectDefinition } from './types.js';

/** Maximum device-pixel-ratio for the render canvas. Caps at 2 to avoid
 *  memory blowout on 3×+ mobile screens. */
const MAX_DPR = 2;

/**
 * Global render queue — serialises WebGL renders across all instances
 * so at most one context exists at a time, keeping peak GPU memory low.
 */
let renderQueue: Promise<void> = Promise.resolve();
function enqueueRender(fn: () => Promise<void>): Promise<void> {
  const next = renderQueue.then(fn, fn);
  renderQueue = next;
  return next;
}

/** Public properties that require re-rendering the effect when changed. */
const RENDER_PROPS: ReadonlySet<string> = new Set([
  'effect',
  'dotRadius',
  'gridSize',
  'angleC',
  'angleM',
  'angleY',
  'angleK',
  'showC',
  'showM',
  'showY',
  'showK',
  'intensityK',
  'duotoneColor',
  'angle',
  'dotOffsetX',
  'dotOffsetY',
  'bgColor',
  'angleWarm',
  'angleCool',
  'showWarm',
  'showCool',
  'warmColor',
  'coolColor',
  'blendMode',
]);

export class SomeShadeImage extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      max-width: 100%;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
    }
    img.snapshot {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    img.snapshot.loaded {
      opacity: 1;
    }
  `;

  @property() src = '';
  @property() effect = 'halftone-cmyk';
  @property({ type: Number, attribute: 'dot-radius' }) dotRadius = 4;
  @property({ type: Number, attribute: 'grid-size' }) gridSize = 8;
  @property({ type: Number, attribute: 'angle-c' }) angleC = 15;
  @property({ type: Number, attribute: 'angle-m' }) angleM = 75;
  @property({ type: Number, attribute: 'angle-y' }) angleY = 0;
  @property({ type: Number, attribute: 'angle-k' }) angleK = 45;
  @property({ type: Number, attribute: 'show-c' }) showC = 1;
  @property({ type: Number, attribute: 'show-m' }) showM = 1;
  @property({ type: Number, attribute: 'show-y' }) showY = 1;
  @property({ type: Number, attribute: 'show-k' }) showK = 1;
  @property({ type: Number, attribute: 'intensity-k' }) intensityK = 1;
  @property({ attribute: 'duotone-color' }) duotoneColor = '#0099cc';
  @property({ type: Number }) angle = 0;
  @property({ type: Number, attribute: 'dot-offset-x' }) dotOffsetX = 0.5;
  @property({ type: Number, attribute: 'dot-offset-y' }) dotOffsetY = 0.5;
  @property({ attribute: 'bg-color' }) bgColor = '#ffffff';
  @property({ type: Number, attribute: 'angle-warm' }) angleWarm = 15;
  @property({ type: Number, attribute: 'angle-cool' }) angleCool = 75;
  @property({ type: Number, attribute: 'show-warm' }) showWarm = 1;
  @property({ type: Number, attribute: 'show-cool' }) showCool = 1;
  @property({ attribute: 'warm-color' }) warmColor = '#d94010';
  @property({ attribute: 'cool-color' }) coolColor = '#0da699';
  @property({ type: Number, attribute: 'blend-mode' }) blendMode = 1;
  @property({ type: Number, attribute: 'loading-blur' }) loadingBlur = 0;

  @state() private _webglAvailable = true;
  @state() private _snapshotUrl = '';
  @state() private _snapshotLoaded = false;

  private _image: HTMLImageElement | null = null;
  private _observer: IntersectionObserver | null = null;
  private _visible = false;
  private _needsRender = false;

  override render() {
    if (!this._webglAvailable) {
      return html`<img src=${this.src} alt="" />`;
    }
    // Source image is always the base layer. The processed snapshot fades
    // in on top once the blob image has finished loading.
    const blurStyle = this.loadingBlur > 0 ? `filter: blur(${this.loadingBlur}px)` : '';
    return html`
      <img src=${this.src} alt="" style=${blurStyle} />
      ${this._snapshotUrl
        ? html`<img
            class="snapshot${this._snapshotLoaded ? ' loaded' : ''}"
            src=${this._snapshotUrl}
            @load=${this._onSnapshotLoad}
            alt="" />`
        : ''}
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._observer = new IntersectionObserver(
      (entries) => {
        const wasVisible = this._visible;
        this._visible = entries[0]?.isIntersecting ?? false;
        if (this._visible && !wasVisible && this._needsRender) {
          this._needsRender = false;
          enqueueRender(() => this._renderEffect());
        }
      },
      // Start rendering slightly before the element scrolls into view.
      { rootMargin: '200px' },
    );
    this._observer.observe(this);

  }

  override updated(changed: PropertyValues): void {
    if (changed.has('src') && this.src) {
      this._loadImage(this.src);
      return;
    }

    if (!this._image) return;

    const needsRender = [...changed.keys()].some((k) =>
      RENDER_PROPS.has(k as string),
    );
    if (needsRender) {
      this._scheduleRender();
    }

  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._revokeSnapshot();
  }

  // ---------------------------------------------------------------------------
  // Image loading
  // ---------------------------------------------------------------------------

  private _loadImage(src: string): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this._image = img;
      this._scheduleRender();
    };
    img.onerror = () => {
      console.warn(`[some-shade] Failed to load image: ${src}`);
    };
    img.src = src;
  }

  // ---------------------------------------------------------------------------
  // Render scheduling
  // ---------------------------------------------------------------------------

  private _scheduleRender(): void {
    if (this._visible) {
      enqueueRender(() => this._renderEffect());
    } else {
      this._needsRender = true;
    }
  }

  // ---------------------------------------------------------------------------
  // WebGL render → snapshot → tear-down
  // ---------------------------------------------------------------------------

  private async _renderEffect(): Promise<void> {
    if (!this._image) return;

    const effectDef = getEffect(this.effect);
    if (!effectDef) {
      console.warn(`[some-shade] Unknown effect: ${this.effect}`);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = this._image.naturalWidth;
    const h = this._image.naturalHeight;
    // Temporary offscreen canvas — not added to the DOM.
    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const gl = createWebGLContext(canvas);
    if (!gl) {
      this._webglAvailable = false;
      return;
    }

    try {
      const programInfo = createProgram(
        gl,
        effectDef.vertexShader,
        effectDef.fragmentShader,
      );
      gl.useProgram(programInfo.program);

      const textureInfo = loadTexture(gl, this._image);
      const quadBuffer = createQuad(gl, programInfo);

      // Draw
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
      const imageLoc = programInfo.uniformLocations.get('u_image');
      if (imageLoc) gl.uniform1i(imageLoc, 0);

      setUniforms(
        gl,
        programInfo,
        this._getUniformValues(textureInfo, dpr),
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const stride = 4 * Float32Array.BYTES_PER_ELEMENT;

      const posLoc = programInfo.attribLocations.get('a_position');
      if (posLoc !== undefined && posLoc !== -1) {
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
      }
      const texLoc = programInfo.attribLocations.get('a_texCoord');
      if (texLoc !== undefined && texLoc !== -1) {
        gl.enableVertexAttribArray(texLoc);
        gl.vertexAttribPointer(
          texLoc,
          2,
          gl.FLOAT,
          false,
          stride,
          2 * Float32Array.BYTES_PER_ELEMENT,
        );
      }

      drawQuad(gl);

      // Snapshot the rendered canvas to a blob URL.
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );

      // Release WebGL resources.
      gl.deleteTexture(textureInfo.texture);
      gl.deleteProgram(programInfo.program);
      gl.deleteBuffer(quadBuffer);

      if (blob) {
        this._snapshotLoaded = false;
        this._revokeSnapshot();
        this._snapshotUrl = URL.createObjectURL(blob);
      }
    } finally {
      // Always drop the context regardless of success/failure.
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private _onSnapshotLoad(): void {
    this._snapshotLoaded = true;
  }

  /** Hide the rendered snapshot momentarily, then fade it back in.
   *  Useful for previewing the loading-blur transition. */
  replayTransition(delay = 500): void {
    if (!this._snapshotUrl) return;
    this._snapshotLoaded = false;
    this.updateComplete.then(() => {
      setTimeout(() => {
        this._snapshotLoaded = true;
      }, delay);
    });
  }

  private _revokeSnapshot(): void {
    if (this._snapshotUrl) {
      URL.revokeObjectURL(this._snapshotUrl);
      this._snapshotUrl = '';
    }
  }

  private _getUniformValues(
    textureInfo: TextureInfo,
    dpr: number,
  ): Record<string, number | number[]> {
    const uniforms: Record<string, number | number[]> = {};

    uniforms['u_resolution'] = [
      textureInfo.width * dpr,
      textureInfo.height * dpr,
    ];
    uniforms['u_dotRadius'] = this.dotRadius;
    uniforms['u_gridSize'] = this.gridSize;

    if (this.effect === 'halftone-cmyk') {
      uniforms['u_angleC'] = this.angleC;
      uniforms['u_angleM'] = this.angleM;
      uniforms['u_angleY'] = this.angleY;
      uniforms['u_angleK'] = this.angleK;
      uniforms['u_showC'] = this.showC;
      uniforms['u_showM'] = this.showM;
      uniforms['u_showY'] = this.showY;
      uniforms['u_showK'] = this.showK;
      uniforms['u_intensityK'] = this.intensityK;
    } else if (this.effect === 'halftone-duotone') {
      uniforms['u_duotoneColor'] = this._parseHexColor(this.duotoneColor);
      uniforms['u_angle'] = this.angle;
    } else if (this.effect === 'dot-grid') {
      uniforms['u_dotOffset'] = [this.dotOffsetX, this.dotOffsetY];
      uniforms['u_bgColor'] = this._parseHexColor(this.bgColor);
      uniforms['u_angle'] = this.angle;
    } else if (this.effect === 'technicolor-2strip') {
      uniforms['u_angleWarm'] = this.angleWarm;
      uniforms['u_angleCool'] = this.angleCool;
      uniforms['u_angleK'] = this.angleK;
      uniforms['u_showWarm'] = this.showWarm;
      uniforms['u_showCool'] = this.showCool;
      uniforms['u_showK'] = this.showK;
      uniforms['u_warmColor'] = this._parseHexColor(this.warmColor);
      uniforms['u_coolColor'] = this._parseHexColor(this.coolColor);
      uniforms['u_blendMode'] = this.blendMode;
      uniforms['u_intensityK'] = this.intensityK;
    }

    return uniforms;
  }

  private _parseHexColor(hex: string): number[] {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
}

if (!customElements.get('some-shade-image')) {
  customElements.define('some-shade-image', SomeShadeImage);
}
