import React, { useReducer } from 'react';
import ControlPanel from './components/ControlPanel';
import ImageInput from './components/ImageInput';
import ExportPanel from './components/ExportPanel';

interface State {
  src: string;
  effect: string;
  dotRadius: number;
  gridSize: number;
  angleC: number;
  angleM: number;
  angleY: number;
  angleK: number;
  duotoneColor: string;
  angle: number;
}

type Action = { type: 'SET'; key: keyof State; value: string | number };

const initialState: State = {
  src: 'https://picsum.photos/id/1015/800/600',
  effect: 'halftone-cmyk',
  dotRadius: 4,
  gridSize: 8,
  angleC: 15,
  angleM: 75,
  angleY: 0,
  angleK: 45,
  duotoneColor: '#0099cc',
  angle: 0,
};

function reducer(state: State, action: Action): State {
  return { ...state, [action.key]: action.value };
}

// Tell TS about the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'some-shade-image': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          effect?: string;
          'dot-radius'?: number;
          'grid-size'?: number;
          'angle-c'?: number;
          'angle-m'?: number;
          'angle-y'?: number;
          'angle-k'?: number;
          'duotone-color'?: string;
          angle?: number;
        },
        HTMLElement
      >;
    }
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const set = (key: keyof State) => (value: string | number) =>
    dispatch({ type: 'SET', key, value });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Some Shade</h1>
        <p className="text-sm text-zinc-500">WebGL halftone shader playground</p>
      </header>

      <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* Preview */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <some-shade-image
              src={state.src}
              effect={state.effect}
              dot-radius={state.dotRadius}
              grid-size={state.gridSize}
              angle-c={state.angleC}
              angle-m={state.angleM}
              angle-y={state.angleY}
              angle-k={state.angleK}
              duotone-color={state.duotoneColor}
              angle={state.angle}
            />
          </div>
        </div>

        {/* Controls */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          <ImageInput src={state.src} onChange={set('src')} />
          <ControlPanel
            effect={state.effect}
            onEffectChange={set('effect')}
            dotRadius={state.dotRadius}
            onDotRadiusChange={set('dotRadius')}
            gridSize={state.gridSize}
            onGridSizeChange={set('gridSize')}
            angleC={state.angleC}
            onAngleCChange={set('angleC')}
            angleM={state.angleM}
            onAngleMChange={set('angleM')}
            angleY={state.angleY}
            onAngleYChange={set('angleY')}
            angleK={state.angleK}
            onAngleKChange={set('angleK')}
            duotoneColor={state.duotoneColor}
            onDuotoneColorChange={set('duotoneColor')}
            angle={state.angle}
            onAngleChange={set('angle')}
          />
          <ExportPanel state={state} />
        </aside>
      </main>
    </div>
  );
}
