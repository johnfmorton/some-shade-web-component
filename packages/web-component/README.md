# Some Shade

WebGL image effects as a web component. Drop `<some-shade-image>` into any page to apply shader-based visual effects to images.

## Install

```bash
npm install @johnfmorton/some-shade
```

`lit` is a dependency and will be installed automatically.

## Quick Start

```html
<script type="module">
  import '@johnfmorton/some-shade';
</script>

<some-shade-image
  src="photo.jpg"
  effect="halftone-cmyk"
  dot-radius="4"
  grid-size="8"
></some-shade-image>
```

## Effects

### CMYK Halftone (`halftone-cmyk`)

Simulates a CMYK halftone print screen with per-channel angle control, visibility toggles, and black channel intensity.

```html
<some-shade-image
  src="photo.jpg"
  effect="halftone-cmyk"
  dot-radius="4"
  grid-size="8"
  angle-c="15"
  angle-m="75"
  angle-y="0"
  angle-k="45"
  show-c="1"
  show-m="1"
  show-y="1"
  show-k="1"
  intensity-k="1"
></some-shade-image>
```

### Duotone Halftone (`halftone-duotone`)

Halftone effect using a single custom color.

```html
<some-shade-image
  src="photo.jpg"
  effect="halftone-duotone"
  dot-radius="4"
  grid-size="8"
  duotone-color="#0099cc"
  angle="0"
></some-shade-image>
```

### Dot Grid (`dot-grid`)

Renders the image as a grid of dots with a customizable background.

```html
<some-shade-image
  src="photo.jpg"
  effect="dot-grid"
  dot-radius="4"
  grid-size="8"
  dot-offset-x="0.5"
  dot-offset-y="0.5"
  bg-color="#ffffff"
  angle="0"
></some-shade-image>
```

### 2-Strip Technicolor (`technicolor-2strip`)

Simulates the early two-strip Technicolor film process with warm and cool dye channels plus a black (K) channel for detail. Choose between three blend modes for different color mixing behavior.

```html
<some-shade-image
  src="photo.jpg"
  effect="technicolor-2strip"
  dot-radius="7"
  grid-size="10"
  angle-warm="15"
  angle-cool="75"
  angle-k="45"
  show-warm="1"
  show-cool="1"
  show-k="1"
  warm-color="#d94010"
  cool-color="#0da699"
  blend-mode="1"
  intensity-k="1"
></some-shade-image>
```

**Blend modes:** `0` = Subtractive (dye overlap darkens), `1` = Additive (light overlap brightens), `2` = Screen (soft additive clamping).

## Attributes Reference

### Universal

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | `""` | Image source URL |
| `effect` | string | `"halftone-cmyk"` | Active effect name |
| `dot-radius` | number | `4` | Dot radius in pixels |
| `grid-size` | number | `8` | Grid cell size in pixels |
| `loading-blur` | number | `0` | Blur (px) applied to the source image while the effect renders |

### CMYK Halftone

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `angle-c` | number | `15` | Cyan channel angle (degrees) |
| `angle-m` | number | `75` | Magenta channel angle (degrees) |
| `angle-y` | number | `0` | Yellow channel angle (degrees) |
| `angle-k` | number | `45` | Black channel angle (degrees) |
| `show-c` | number | `1` | Show cyan channel (0 or 1) |
| `show-m` | number | `1` | Show magenta channel (0 or 1) |
| `show-y` | number | `1` | Show yellow channel (0 or 1) |
| `show-k` | number | `1` | Show black channel (0 or 1) |
| `intensity-k` | number | `1` | Black channel intensity multiplier (0–2) |

### Duotone Halftone

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `duotone-color` | string | `"#0099cc"` | Highlight color (hex) |
| `angle` | number | `0` | Grid angle (degrees) |

### Dot Grid

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `dot-offset-x` | number | `0.5` | Horizontal dot offset (0–1) |
| `dot-offset-y` | number | `0.5` | Vertical dot offset (0–1) |
| `bg-color` | string | `"#ffffff"` | Background color (hex) |
| `angle` | number | `0` | Grid angle (degrees) |

### 2-Strip Technicolor

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `angle-warm` | number | `15` | Warm channel angle (degrees) |
| `angle-cool` | number | `75` | Cool channel angle (degrees) |
| `angle-k` | number | `45` | Black channel angle (degrees) |
| `show-warm` | number | `1` | Show warm channel (0 or 1) |
| `show-cool` | number | `1` | Show cool channel (0 or 1) |
| `show-k` | number | `1` | Show black channel (0 or 1) |
| `warm-color` | string | `"#d94010"` | Warm dye color (hex) |
| `cool-color` | string | `"#0da699"` | Cool dye color (hex) |
| `blend-mode` | number | `1` | Blend mode: 0 = Subtractive, 1 = Additive, 2 = Screen |
| `intensity-k` | number | `1` | Black channel intensity multiplier (0–2) |

## Methods

### `replayTransition(delay?: number)`

Hides the rendered snapshot and fades it back in after a delay. Useful for previewing the loading blur transition.

```js
const el = document.querySelector('some-shade-image');
el.replayTransition(500);
```

## Framework Usage

The component works in any framework. Import `@johnfmorton/some-shade` once to register the custom element, then use `<some-shade-image>` in your templates.

### React

```tsx
import '@johnfmorton/some-shade';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'some-shade-image': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          effect?: string;
          'dot-radius'?: number;
          'grid-size'?: number;
        },
        HTMLElement
      >;
    }
  }
}

function App() {
  return (
    <some-shade-image
      src="photo.jpg"
      effect="halftone-cmyk"
      dot-radius={4}
      grid-size={8}
    />
  );
}
```

## Custom Effects

Register your own shader effects using the `register()` API:

```ts
import { register } from '@johnfmorton/some-shade';

register({
  name: 'my-effect',
  vertexShader: `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    uniform float u_intensity;
    void main() {
      gl_FragColor = texture2D(u_image, v_texCoord) * u_intensity;
    }
  `,
  uniforms: [
    { name: 'u_intensity', type: 'float', default: 1.0, attribute: 'intensity' },
  ],
});
```

Then use it:

```html
<some-shade-image src="photo.jpg" effect="my-effect" intensity="0.8"></some-shade-image>
```

### `EffectDefinition`

```ts
interface EffectDefinition {
  name: string;
  fragmentShader: string;
  vertexShader: string;
  uniforms: UniformDefinition[];
}

interface UniformDefinition {
  name: string;
  type: 'float' | 'vec2' | 'vec3' | 'vec4';
  default: number | number[];
  attribute?: string;
}
```

## Programmatic API

```ts
import { register, get, list, SomeShadeImage } from '@johnfmorton/some-shade';

register(effectDef);            // Register a custom effect
get('halftone-cmyk');           // Get an effect definition by name
list();                         // List all registered effect names
```

`SomeShadeImage` is the Lit component class, exported for subclassing or direct use.

## Browser Support

Requires WebGL. If WebGL is unavailable, the component falls back to a plain `<img>` element.

## Development

```bash
pnpm install
pnpm dev            # Watch mode (component + playground)
pnpm build          # Build everything
pnpm build:component # Build web component only
```

## License

ISC
