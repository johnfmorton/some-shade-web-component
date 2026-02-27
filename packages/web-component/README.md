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

Simulates a CMYK halftone print screen with per-channel angle control.

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

### Pixel Sort

Sorts pixels by luminance along a configurable direction.

```html
<some-shade-image
  src="photo.jpg"
  effect="pixel-sort"
  threshold="0.5"
  sort-direction="0"
  sort-span="64"
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
></some-shade-image>
```

## Attributes Reference

| Attribute | Type | Default | Effects |
|-----------|------|---------|---------|
| `src` | string | `""` | all |
| `effect` | string | `"halftone-cmyk"` | all |
| `dot-radius` | number | `4` | halftone-cmyk, halftone-duotone, dot-grid |
| `grid-size` | number | `8` | halftone-cmyk, halftone-duotone, dot-grid |
| `angle-c` | number | `15` | halftone-cmyk |
| `angle-m` | number | `75` | halftone-cmyk |
| `angle-y` | number | `0` | halftone-cmyk |
| `angle-k` | number | `45` | halftone-cmyk |
| `duotone-color` | string (hex) | `"#0099cc"` | halftone-duotone |
| `angle` | number | `0` | halftone-duotone |
| `threshold` | number | `0.5` | pixel-sort |
| `sort-direction` | number | `0` | pixel-sort |
| `sort-span` | number | `64` | pixel-sort |
| `dot-offset-x` | number | `0.5` | dot-grid |
| `dot-offset-y` | number | `0.5` | dot-grid |
| `bg-color` | string (hex) | `"#ffffff"` | dot-grid |

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
