import React from 'react';
import Slider from './Slider';

interface ControlPanelProps {
  effect: string;
  onEffectChange: (effect: string) => void;
  dotRadius: number;
  onDotRadiusChange: (v: number) => void;
  gridSize: number;
  onGridSizeChange: (v: number) => void;
  angleC: number;
  onAngleCChange: (v: number) => void;
  angleM: number;
  onAngleMChange: (v: number) => void;
  angleY: number;
  onAngleYChange: (v: number) => void;
  angleK: number;
  onAngleKChange: (v: number) => void;
  showC: number;
  onShowCChange: (v: number) => void;
  showM: number;
  onShowMChange: (v: number) => void;
  showY: number;
  onShowYChange: (v: number) => void;
  showK: number;
  onShowKChange: (v: number) => void;
  intensityK: number;
  onIntensityKChange: (v: number) => void;
  duotoneColor: string;
  onDuotoneColorChange: (v: string) => void;
  angle: number;
  onAngleChange: (v: number) => void;
  dotOffsetX: number;
  onDotOffsetXChange: (v: number) => void;
  dotOffsetY: number;
  onDotOffsetYChange: (v: number) => void;
  bgColor: string;
  onBgColorChange: (v: string) => void;
  angleWarm: number;
  onAngleWarmChange: (v: number) => void;
  angleCool: number;
  onAngleCoolChange: (v: number) => void;
  showWarm: number;
  onShowWarmChange: (v: number) => void;
  showCool: number;
  onShowCoolChange: (v: number) => void;
  warmColor: string;
  onWarmColorChange: (v: string) => void;
  coolColor: string;
  onCoolColorChange: (v: string) => void;
  blendMode: number;
  onBlendModeChange: (v: number) => void;
  referenceWidth: number;
  onReferenceWidthChange: (v: number) => void;
  displayWidth: number;
  onDisplayWidthChange: (v: number) => void;
  onPreviewTransition: () => void;
}

const EFFECTS = [
  { value: 'halftone-cmyk', label: 'CMYK' },
  { value: 'halftone-duotone', label: 'Duotone' },
  { value: 'dot-grid', label: 'Dot Grid' },
  { value: 'technicolor-2strip', label: '2-Strip' },
];

export default function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col gap-5">
      {/* Effect toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-zinc-400">Effect</label>
        <div className="flex gap-1 bg-zinc-800 p-1 rounded-lg">
          {EFFECTS.map((e) => (
            <button
              key={e.value}
              onClick={() => props.onEffectChange(e.value)}
              className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                props.effect === e.value
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shared dot/grid sliders */}
      {(props.effect === 'halftone-cmyk' || props.effect === 'halftone-duotone' || props.effect === 'dot-grid' || props.effect === 'technicolor-2strip') && (
        <>
          <Slider label="Dot Radius" value={props.dotRadius} onChange={props.onDotRadiusChange} min={0.5} max={20} step={0.5} />
          <Slider label="Grid Size" value={props.gridSize} onChange={props.onGridSizeChange} min={2} max={40} step={1} />
        </>
      )}

      {/* CMYK angles */}
      {props.effect === 'halftone-cmyk' && (
        <div className="flex flex-col gap-4">
          <label className="text-sm text-zinc-400">Channel Angles</label>
          {([
            { label: 'Cyan', angle: props.angleC, onAngle: props.onAngleCChange, show: props.showC, onShow: props.onShowCChange },
            { label: 'Magenta', angle: props.angleM, onAngle: props.onAngleMChange, show: props.showM, onShow: props.onShowMChange },
            { label: 'Yellow', angle: props.angleY, onAngle: props.onAngleYChange, show: props.showY, onShow: props.onShowYChange },
            { label: 'Black', angle: props.angleK, onAngle: props.onAngleKChange, show: props.showK, onShow: props.onShowKChange },
          ] as const).map(({ label, angle, onAngle, show, onShow }) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => onShow(show ? 0 : 1)}
                className={`w-8 h-8 rounded-md border text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                  show
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                title={`${show ? 'Hide' : 'Show'} ${label}`}
              >
                {show ? 'ON' : '—'}
              </button>
              <div className="flex-1 min-w-0">
                <Slider label={label} value={angle} onChange={onAngle} min={0} max={180} step={1} />
              </div>
            </div>
          ))}
          <Slider label="K Intensity" value={props.intensityK} onChange={props.onIntensityKChange} min={0} max={2} step={0.05} />
        </div>
      )}

      {/* Duotone controls */}
      {props.effect === 'halftone-duotone' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Duotone Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={props.duotoneColor}
                onChange={(e) => props.onDuotoneColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-zinc-300 font-mono">{props.duotoneColor}</span>
            </div>
          </div>
          <Slider label="Grid Angle" value={props.angle} onChange={props.onAngleChange} min={0} max={180} step={1} />
        </div>
      )}

      {/* Dot Grid controls */}
      {props.effect === 'dot-grid' && (
        <div className="flex flex-col gap-4">
          <Slider label="Grid Angle" value={props.angle} onChange={props.onAngleChange} min={0} max={180} step={1} />
          <Slider label="Dot Offset X" value={props.dotOffsetX} onChange={props.onDotOffsetXChange} min={0} max={1} step={0.01} />
          <Slider label="Dot Offset Y" value={props.dotOffsetY} onChange={props.onDotOffsetYChange} min={0} max={1} step={0.01} />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={props.bgColor}
                onChange={(e) => props.onBgColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-zinc-300 font-mono">{props.bgColor}</span>
            </div>
          </div>
        </div>
      )}

      {/* Technicolor 2-Strip controls */}
      {props.effect === 'technicolor-2strip' && (
        <div className="flex flex-col gap-4">
          <label className="text-sm text-zinc-400">Channel Angles</label>
          {([
            { label: 'Warm', angle: props.angleWarm, onAngle: props.onAngleWarmChange, show: props.showWarm, onShow: props.onShowWarmChange },
            { label: 'Cool', angle: props.angleCool, onAngle: props.onAngleCoolChange, show: props.showCool, onShow: props.onShowCoolChange },
            { label: 'Black', angle: props.angleK, onAngle: props.onAngleKChange, show: props.showK, onShow: props.onShowKChange },
          ] as const).map(({ label, angle, onAngle, show, onShow }) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => onShow(show ? 0 : 1)}
                className={`w-8 h-8 rounded-md border text-xs font-bold shrink-0 cursor-pointer transition-colors ${
                  show
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                }`}
                title={`${show ? 'Hide' : 'Show'} ${label}`}
              >
                {show ? 'ON' : '\u2014'}
              </button>
              <div className="flex-1 min-w-0">
                <Slider label={label} value={angle} onChange={onAngle} min={0} max={180} step={1} />
              </div>
            </div>
          ))}
          <Slider label="K Intensity" value={props.intensityK} onChange={props.onIntensityKChange} min={0} max={2} step={0.05} />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Warm Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={props.warmColor}
                onChange={(e) => props.onWarmColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-zinc-300 font-mono">{props.warmColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Cool Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={props.coolColor}
                onChange={(e) => props.onCoolColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
              />
              <span className="text-sm text-zinc-300 font-mono">{props.coolColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Blend Mode</label>
            <div className="flex gap-1 bg-zinc-800 p-1 rounded-lg">
              {([
                { value: 0, label: 'Subtractive' },
                { value: 1, label: 'Additive' },
                { value: 2, label: 'Screen' },
              ] as const).map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => props.onBlendModeChange(mode.value)}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                    props.blendMode === mode.value
                      ? 'bg-amber-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Display width */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Display Width</span>
          {props.displayWidth > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-300 tabular-nums font-mono text-xs">{props.displayWidth}px</span>
              <button
                onClick={() => props.onDisplayWidthChange(0)}
                className="text-xs text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
              >
                auto
              </button>
            </div>
          ) : (
            <button
              onClick={() => props.onDisplayWidthChange(600)}
              className="text-xs text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
            >
              set width
            </button>
          )}
        </div>
        {props.displayWidth > 0 && (
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={props.displayWidth}
            onChange={(e) => props.onDisplayWidthChange(Number(e.target.value))}
            className="w-full"
          />
        )}
      </div>

      {/* Reference width */}
      <Slider label="Reference Width" value={props.referenceWidth} onChange={props.onReferenceWidthChange} min={256} max={4096} step={64} />

      <button
        onClick={props.onPreviewTransition}
        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        Preview loading transition
      </button>

    </div>
  );
}
