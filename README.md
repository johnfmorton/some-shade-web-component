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

### CMYK Halftone

Simulates a CMYK halftone print screen with per-channel angle control. Individual channels can be toggled with `show-c`, `show-m`, `show-y`, and `show-k`.

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

### Duotone Halftone

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

### Technicolor 2-Strip

Simulates early two-strip Technicolor film with warm and cool dye channels plus a black channel, each rendered as halftone dots at independent angles. Dye colors are customizable.

```html
<some-shade-image
  src="photo.jpg"
  effect="technicolor-2strip"
  dot-radius="4"
  grid-size="8"
  angle-warm="15"
  angle-cool="75"
  angle-k="45"
  warm-color="#d94010"
  cool-color="#0da699"
></some-shade-image>
```

### Dot Grid

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

## Attributes Reference

### Global

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | `""` | Image URL |
| `effect` | string | `"halftone-cmyk"` | Effect name |
| `loading-blur` | number | `0` | Blur radius (px) applied to the source image while the effect loads |

### Shared (per-effect)

| Attribute | Type | Default | Effects |
|-----------|------|---------|---------|
| `dot-radius` | number | `4` | halftone-cmyk, halftone-duotone, dot-grid, technicolor-2strip |
| `grid-size` | number | `8` | halftone-cmyk, halftone-duotone, dot-grid, technicolor-2strip |

### CMYK Halftone

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `angle-c` | number | `15` | Cyan screen angle |
| `angle-m` | number | `75` | Magenta screen angle |
| `angle-y` | number | `0` | Yellow screen angle |
| `angle-k` | number | `45` | Black screen angle |
| `show-c` | number | `1` | Show cyan channel (0/1) |
| `show-m` | number | `1` | Show magenta channel (0/1) |
| `show-y` | number | `1` | Show yellow channel (0/1) |
| `show-k` | number | `1` | Show black channel (0/1) |
| `intensity-k` | number | `1` | Black channel intensity multiplier (0–2) |

### Duotone Halftone

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `duotone-color` | string (hex) | `"#0099cc"` | Paper/highlight color |
| `angle` | number | `0` | Grid rotation angle |

### Technicolor 2-Strip

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `angle-warm` | number | `15` | Warm channel screen angle |
| `angle-cool` | number | `75` | Cool channel screen angle |
| `angle-k` | number | `45` | Black channel screen angle |
| `show-warm` | number | `1` | Show warm channel (0/1) |
| `show-cool` | number | `1` | Show cool channel (0/1) |
| `show-k` | number | `1` | Show black channel (0/1) |
| `warm-color` | string (hex) | `"#d94010"` | Warm dye color |
| `cool-color` | string (hex) | `"#0da699"` | Cool dye color |

### Dot Grid

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `angle` | number | `0` | Grid rotation angle |
| `dot-offset-x` | number | `0.5` | Horizontal dot position within cell (0-1) |
| `dot-offset-y` | number | `0.5` | Vertical dot position within cell (0-1) |
| `bg-color` | string (hex) | `"#ffffff"` | Background color |

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

### `replayTransition(delay?: number)`

Hides the rendered snapshot and fades it back in after `delay` ms (default 500). Useful for previewing the `loading-blur` transition.

```js
document.querySelector('some-shade-image').replayTransition();
```

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
