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
  duotoneColor: string;
  onDuotoneColorChange: (v: string) => void;
  angle: number;
  onAngleChange: (v: number) => void;
  threshold: number;
  onThresholdChange: (v: number) => void;
  sortDirection: number;
  onSortDirectionChange: (v: number) => void;
  sortSpan: number;
  onSortSpanChange: (v: number) => void;
  dotOffsetX: number;
  onDotOffsetXChange: (v: number) => void;
  dotOffsetY: number;
  onDotOffsetYChange: (v: number) => void;
  bgColor: string;
  onBgColorChange: (v: string) => void;
}

const EFFECTS = [
  { value: 'halftone-cmyk', label: 'CMYK' },
  { value: 'halftone-duotone', label: 'Duotone' },
  { value: 'pixel-sort', label: 'Pixel Sort' },
  { value: 'dot-grid', label: 'Dot Grid' },
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
      {(props.effect === 'halftone-cmyk' || props.effect === 'halftone-duotone' || props.effect === 'dot-grid') && (
        <>
          <Slider label="Dot Radius" value={props.dotRadius} onChange={props.onDotRadiusChange} min={0.5} max={20} step={0.5} />
          <Slider label="Grid Size" value={props.gridSize} onChange={props.onGridSizeChange} min={2} max={40} step={1} />
        </>
      )}

      {/* CMYK angles */}
      {props.effect === 'halftone-cmyk' && (
        <div className="flex flex-col gap-4">
          <label className="text-sm text-zinc-400">Channel Angles</label>
          <Slider label="Cyan" value={props.angleC} onChange={props.onAngleCChange} min={0} max={180} step={1} />
          <Slider label="Magenta" value={props.angleM} onChange={props.onAngleMChange} min={0} max={180} step={1} />
          <Slider label="Yellow" value={props.angleY} onChange={props.onAngleYChange} min={0} max={180} step={1} />
          <Slider label="Black" value={props.angleK} onChange={props.onAngleKChange} min={0} max={180} step={1} />
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

      {/* Pixel Sort controls */}
      {props.effect === 'pixel-sort' && (
        <div className="flex flex-col gap-4">
          <Slider label="Threshold" value={props.threshold} onChange={props.onThresholdChange} min={0} max={1} step={0.01} />
          <Slider label="Direction" value={props.sortDirection} onChange={props.onSortDirectionChange} min={0} max={360} step={1} />
          <Slider label="Span" value={props.sortSpan} onChange={props.onSortSpanChange} min={8} max={256} step={8} />
        </div>
      )}
    </div>
  );
}
