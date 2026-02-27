import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createWebGLContext } from './gl/context.js';
import { createProgram, setUniforms, type ProgramInfo } from './gl/program.js';
import { loadTexture, type TextureInfo } from './gl/texture.js';
import { createQuad, drawQuad } from './gl/quad.js';
import { get as getEffect } from './registry.js';
import type { EffectDefinition } from './types.js';

@customElement('some-shade-image')
export class SomeShadeImage extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
    }
    canvas, img {
      display: block;
      width: 100%;
      height: auto;
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
  @property({ attribute: 'duotone-color' }) duotoneColor = '#0099cc';
  @property({ type: Number }) angle = 0;
  @property({ type: Number }) threshold = 0.5;
  @property({ type: Number, attribute: 'sort-direction' }) sortDirection = 0;
  @property({ type: Number, attribute: 'sort-span' }) sortSpan = 64;
  @property({ type: Number, attribute: 'dot-offset-x' }) dotOffsetX = 0.5;
  @property({ type: Number, attribute: 'dot-offset-y' }) dotOffsetY = 0.5;
  @property({ attribute: 'bg-color' }) bgColor = '#ffffff';

  @state() private _webglAvailable = true;

  private _canvas: HTMLCanvasElement | null = null;
  private _gl: WebGLRenderingContext | null = null;
  private _programInfo: ProgramInfo | null = null;
  private _textureInfo: TextureInfo | null = null;
  private _quadBuffer: WebGLBuffer | null = null;
  private _currentEffect: EffectDefinition | null = null;
  private _image: HTMLImageElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;

  override render() {
    if (!this._webglAvailable) {
      return html`<img .src=${this.src} alt="" />`;
    }
    return html`<canvas></canvas>`;
  }

  override firstUpdated(): void {
    if (!this._webglAvailable) return;

    this._canvas = this.shadowRoot!.querySelector('canvas');
    if (!this._canvas) return;

    this._gl = createWebGLContext(this._canvas);
    if (!this._gl) {
      this._webglAvailable = false;
      this.classList.add('webgl-unavailable');
      return;
    }

    this._resizeObserver = new ResizeObserver(() => this._handleResize());
    this._resizeObserver.observe(this);

    if (this.src) {
      this._loadImage(this.src);
    }
  }

  override updated(changed: PropertyValues): void {
    if (!this._gl) return;

    if (changed.has('src') && this.src) {
      this._loadImage(this.src);
      return;
    }

    if (changed.has('effect')) {
      this._setupProgram();
      this._renderFrame();
      return;
    }

    // Uniform-only changes — fast path
    this._renderFrame();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._cleanup();
  }

  private _loadImage(src: string): void {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this._image = img;
      this._uploadTexture();
      this._sizeCanvas();
      this._setupProgram();
      this._renderFrame();
    };
    img.onerror = () => {
      console.warn(`[some-shade] Failed to load image: ${src}`);
    };
    img.src = src;
  }

  private _uploadTexture(): void {
    if (!this._gl || !this._image) return;

    // Delete old texture
    if (this._textureInfo) {
      this._gl.deleteTexture(this._textureInfo.texture);
    }

    this._textureInfo = loadTexture(this._gl, this._image);
  }

  private _sizeCanvas(): void {
    if (!this._canvas || !this._textureInfo) return;

    const dpr = window.devicePixelRatio || 1;
    const w = this._textureInfo.width;
    const h = this._textureInfo.height;

    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.aspectRatio = `${w} / ${h}`;
  }

  private _handleResize(): void {
    this._renderFrame();
  }

  private _setupProgram(): void {
    if (!this._gl) return;

    const effectDef = getEffect(this.effect);
    if (!effectDef) {
      console.warn(`[some-shade] Unknown effect: ${this.effect}`);
      return;
    }

    // Delete old program
    if (this._programInfo) {
      this._gl.deleteProgram(this._programInfo.program);
    }

    this._currentEffect = effectDef;
    this._programInfo = createProgram(this._gl, effectDef.vertexShader, effectDef.fragmentShader);

    // Recreate quad with new program's attrib locations
    if (this._quadBuffer) {
      this._gl.deleteBuffer(this._quadBuffer);
    }
    this._gl.useProgram(this._programInfo.program);
    this._quadBuffer = createQuad(this._gl, this._programInfo);
  }

  private _getUniformValues(): Record<string, number | number[]> {
    const uniforms: Record<string, number | number[]> = {};

    if (!this._textureInfo) return uniforms;

    uniforms['u_resolution'] = [
      this._textureInfo.width * (window.devicePixelRatio || 1),
      this._textureInfo.height * (window.devicePixelRatio || 1),
    ];
    uniforms['u_dotRadius'] = this.dotRadius;
    uniforms['u_gridSize'] = this.gridSize;

    if (this.effect === 'halftone-cmyk') {
      uniforms['u_angleC'] = this.angleC;
      uniforms['u_angleM'] = this.angleM;
      uniforms['u_angleY'] = this.angleY;
      uniforms['u_angleK'] = this.angleK;
    } else if (this.effect === 'halftone-duotone') {
      uniforms['u_duotoneColor'] = this._parseHexColor(this.duotoneColor);
      uniforms['u_angle'] = this.angle;
    } else if (this.effect === 'pixel-sort') {
      uniforms['u_threshold'] = this.threshold;
      uniforms['u_direction'] = this.sortDirection;
      uniforms['u_span'] = this.sortSpan;
    } else if (this.effect === 'dot-grid') {
      uniforms['u_dotOffset'] = [this.dotOffsetX, this.dotOffsetY];
      uniforms['u_bgColor'] = this._parseHexColor(this.bgColor);
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

  private _renderFrame(): void {
    const gl = this._gl;
    if (!gl || !this._programInfo || !this._textureInfo || !this._canvas) return;

    gl.viewport(0, 0, this._canvas.width, this._canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this._programInfo.program);

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._textureInfo.texture);
    const imageLoc = this._programInfo.uniformLocations.get('u_image');
    if (imageLoc) gl.uniform1i(imageLoc, 0);

    // Set uniforms
    setUniforms(gl, this._programInfo, this._getUniformValues());

    // Bind quad and draw
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quadBuffer);

    // Re-setup attrib pointers
    const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
    const posLoc = this._programInfo.attribLocations.get('a_position');
    if (posLoc !== undefined && posLoc !== -1) {
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
    }
    const texLoc = this._programInfo.attribLocations.get('a_texCoord');
    if (texLoc !== undefined && texLoc !== -1) {
      gl.enableVertexAttribArray(texLoc);
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
    }

    drawQuad(gl);
  }

  private _cleanup(): void {
    if (!this._gl) return;
    if (this._textureInfo) this._gl.deleteTexture(this._textureInfo.texture);
    if (this._programInfo) this._gl.deleteProgram(this._programInfo.program);
    if (this._quadBuffer) this._gl.deleteBuffer(this._quadBuffer);
    this._gl = null;
    this._programInfo = null;
    this._textureInfo = null;
    this._quadBuffer = null;
  }
}
