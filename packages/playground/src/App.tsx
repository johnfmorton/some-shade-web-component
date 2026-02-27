import React, { useReducer, useEffect, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import ImageInput from './components/ImageInput';
import ExportPanel from './components/ExportPanel';
import { name as pkgName, version as pkgVersion } from '../../web-component/package.json';

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
  threshold: number;
  sortDirection: number;
  sortSpan: number;
  dotOffsetX: number;
  dotOffsetY: number;
  bgColor: string;
}

type Action =
  | { type: 'SET'; key: keyof State; value: string | number }
  | { type: 'RESET' }
  | { type: 'INIT'; state: State };

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
  threshold: 0.5,
  sortDirection: 0,
  sortSpan: 64,
  dotOffsetX: 0.5,
  dotOffsetY: 0.5,
  bgColor: '#ffffff',
};

/** Maps camelCase state keys to kebab-case HTML attribute names */
const keyToAttr: Record<keyof State, string> = {
  src: 'src',
  effect: 'effect',
  dotRadius: 'dot-radius',
  gridSize: 'grid-size',
  angleC: 'angle-c',
  angleM: 'angle-m',
  angleY: 'angle-y',
  angleK: 'angle-k',
  duotoneColor: 'duotone-color',
  angle: 'angle',
  threshold: 'threshold',
  sortDirection: 'sort-direction',
  sortSpan: 'sort-span',
  dotOffsetX: 'dot-offset-x',
  dotOffsetY: 'dot-offset-y',
  bgColor: 'bg-color',
};

const attrToKey = Object.fromEntries(
  Object.entries(keyToAttr).map(([k, v]) => [v, k]),
) as Record<string, keyof State>;

const STORAGE_KEY = 'some-shade-playground';

const numberKeys = new Set<keyof State>([
  'dotRadius', 'gridSize', 'angleC', 'angleM', 'angleY', 'angleK',
  'angle', 'threshold', 'sortDirection', 'sortSpan', 'dotOffsetX', 'dotOffsetY',
]);

function hydrateState(): State {
  const hydrated = { ...initialState };

  // Layer 2: localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Record<string, unknown>;
      for (const [attr, val] of Object.entries(saved)) {
        const key = attrToKey[attr] ?? attr as keyof State;
        if (key in initialState) {
          (hydrated as Record<string, unknown>)[key] = numberKeys.has(key) ? Number(val) : val;
        }
      }
    }
  } catch { /* ignore corrupt localStorage */ }

  // Layer 3 (highest priority): URL search params
  const params = new URLSearchParams(window.location.search);
  for (const [attr, val] of params.entries()) {
    const key = attrToKey[attr];
    if (key && key !== 'src') {
      (hydrated as Record<string, unknown>)[key] = numberKeys.has(key) ? Number(val) : val;
    }
  }

  return hydrated;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.key]: action.value };
    case 'RESET':
      return { ...initialState };
    case 'INIT':
      return action.state;
    default:
      return state;
  }
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
          threshold?: number;
          'sort-direction'?: number;
          'sort-span'?: number;
          'dot-offset-x'?: number;
          'dot-offset-y'?: number;
          'bg-color'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, hydrateState);
  const initialized = useRef(false);
  const set = (key: keyof State) => (value: string | number) =>
    dispatch({ type: 'SET', key, value });

  // Sync state → URL params + localStorage on every change
  useEffect(() => {
    // Skip the first render (hydration) to avoid clobbering the URL we just read
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    // localStorage: persist all non-src state using kebab-case keys
    const toStore: Record<string, unknown> = {};
    for (const key of Object.keys(initialState) as (keyof State)[]) {
      toStore[keyToAttr[key]] = state[key];
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore)); } catch { /* quota */ }

    // URL: only include params that differ from defaults, exclude src
    const params = new URLSearchParams();
    for (const key of Object.keys(initialState) as (keyof State)[]) {
      if (key === 'src') continue;
      if (state[key] !== initialState[key]) {
        params.set(keyToAttr[key], String(state[key]));
      }
    }
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [state]);

  function handleReset() {
    dispatch({ type: 'RESET' });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.history.replaceState(null, '', window.location.pathname);
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight">Some Shade</h1>
          <p className="text-[13px] text-zinc-500 mt-1 font-light tracking-wide">WebGL halftone shader playground</p>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* Preview */}
        <div className="flex-1 min-w-0">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/20">
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
              threshold={state.threshold}
              sort-direction={state.sortDirection}
              sort-span={state.sortSpan}
              dot-offset-x={state.dotOffsetX}
              dot-offset-y={state.dotOffsetY}
              bg-color={state.bgColor}
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
            threshold={state.threshold}
            onThresholdChange={set('threshold')}
            sortDirection={state.sortDirection}
            onSortDirectionChange={set('sortDirection')}
            sortSpan={state.sortSpan}
            onSortSpanChange={set('sortSpan')}
            dotOffsetX={state.dotOffsetX}
            onDotOffsetXChange={set('dotOffsetX')}
            dotOffsetY={state.dotOffsetY}
            onDotOffsetYChange={set('dotOffsetY')}
            bgColor={state.bgColor}
            onBgColorChange={set('bgColor')}
          />
          <ExportPanel state={state} onReset={handleReset} />
        </aside>
      </main>

      <footer className="mt-auto border-t border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span className="font-mono tracking-tight">{pkgName}@{pkgVersion}</span>
          <a
            href="https://github.com/johnfmorton/some-shade-web-component"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
