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
    dotOffsetX: number;
    dotOffsetY: number;
    bgColor: string;
    loadingBlur: number;
  };
  onReset: () => void;
}

export default function ExportPanel({ state, onReset }: ExportPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  function getAttrs(includeSrc: boolean): string[] {
    const attrs: string[] = [];
    if (includeSrc) attrs.push(`src="${state.src}"`);
    attrs.push(`effect="${state.effect}"`);
    if (state.effect === 'halftone-cmyk') {
      attrs.push(`dot-radius="${state.dotRadius}"`);
      attrs.push(`grid-size="${state.gridSize}"`);
      attrs.push(`angle-c="${state.angleC}"`);
      attrs.push(`angle-m="${state.angleM}"`);
      attrs.push(`angle-y="${state.angleY}"`);
      attrs.push(`angle-k="${state.angleK}"`);
    } else if (state.effect === 'halftone-duotone') {
      attrs.push(`dot-radius="${state.dotRadius}"`);
      attrs.push(`grid-size="${state.gridSize}"`);
      attrs.push(`duotone-color="${state.duotoneColor}"`);
      attrs.push(`angle="${state.angle}"`);
    } else if (state.effect === 'dot-grid') {
      attrs.push(`dot-radius="${state.dotRadius}"`);
      attrs.push(`grid-size="${state.gridSize}"`);
      attrs.push(`angle="${state.angle}"`);
      attrs.push(`dot-offset-x="${state.dotOffsetX}"`);
      attrs.push(`dot-offset-y="${state.dotOffsetY}"`);
      attrs.push(`bg-color="${state.bgColor}"`);
    }
    if (state.loadingBlur > 0) {
      attrs.push(`loading-blur="${state.loadingBlur}"`);
    }
    return attrs;
  }

  function getMarkup() {
    const attrs = getAttrs(true);
    return `<some-shade-image\n  ${attrs.join('\n  ')}\n></some-shade-image>`;
  }

  function getAttributes() {
    return getAttrs(false).join(' ');
  }

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
      <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Export</label>
      <div className="flex gap-2">
        <button
          onClick={() => copyToClipboard(getMarkup(), 'markup')}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {copied === 'markup' ? 'Copied!' : 'Copy Markup'}
        </button>
        <button
          onClick={() => copyToClipboard(getAttributes(), 'attrs')}
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {copied === 'attrs' ? 'Copied!' : 'Copy Attributes'}
        </button>
      </div>
      <button
        onClick={onReset}
        className="px-3 py-2 border border-zinc-700 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors cursor-pointer"
      >
        Restore Defaults
      </button>
    </div>
  );
}
