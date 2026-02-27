import React, { useState } from 'react';

interface ExportPanelProps {
  state: {
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
  };
}

export default function ExportPanel({ state }: ExportPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  function getConfig() {
    const base: Record<string, unknown> = {
      src: state.src,
      effect: state.effect,
      dotRadius: state.dotRadius,
      gridSize: state.gridSize,
    };
    if (state.effect === 'halftone-cmyk') {
      base.angleC = state.angleC;
      base.angleM = state.angleM;
      base.angleY = state.angleY;
      base.angleK = state.angleK;
    } else {
      base.duotoneColor = state.duotoneColor;
      base.angle = state.angle;
    }
    return base;
  }

  function getMarkup() {
    const attrs = [`src="${state.src}"`, `effect="${state.effect}"`];
    attrs.push(`dot-radius="${state.dotRadius}"`);
    attrs.push(`grid-size="${state.gridSize}"`);
    if (state.effect === 'halftone-cmyk') {
      attrs.push(`angle-c="${state.angleC}"`);
      attrs.push(`angle-m="${state.angleM}"`);
      attrs.push(`angle-y="${state.angleY}"`);
      attrs.push(`angle-k="${state.angleK}"`);
    } else {
      attrs.push(`duotone-color="${state.duotoneColor}"`);
      attrs.push(`angle="${state.angle}"`);
    }
    return `<some-shade-image\n  ${attrs.join('\n  ')}\n></some-shade-image>`;
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-zinc-400">Export</label>
      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard(JSON.stringify(getConfig(), null, 2), 'json')}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {copied === 'json' ? 'Copied!' : 'Copy JSON'}
        </button>
        <button
          onClick={() => copyToClipboard(getMarkup(), 'markup')}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {copied === 'markup' ? 'Copied!' : 'Copy Markup'}
        </button>
      </div>
    </div>
  );
}
