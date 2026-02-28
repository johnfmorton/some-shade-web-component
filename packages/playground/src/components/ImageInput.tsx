import React, { useRef } from 'react';

const base = import.meta.env.BASE_URL;

const PRESETS = [
  { label: 'Sample 1', url: `${base}sample-images/catdog1_900x600.png` },
  { label: 'Sample 2', url: `${base}sample-images/catdog2_900x600.png` },
  { label: 'Sample 3', url: `${base}sample-images/catdog3_900x600.png` },
  { label: 'Sample 4', url: `${base}sample-images/catdog4_900x600.png` },
  { label: 'Sample 5', url: `${base}sample-images/catdog5_900x600.png` },
  { label: 'Sample 6', url: `${base}sample-images/catdog6_900x600.png` },
];

interface ImageInputProps {
  src: string;
  onChange: (src: string) => void;
}

export default function ImageInput({ src, onChange }: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
      <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">Image Source</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={src}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.url}
            onClick={() => onChange(p.url)}
            className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
              src === p.url
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
