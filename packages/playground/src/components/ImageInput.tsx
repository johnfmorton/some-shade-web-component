import React, { useRef } from 'react';

const PRESETS = [
  { label: 'Picsum 1', url: 'https://picsum.photos/id/1015/800/600' },
  { label: 'Picsum 2', url: 'https://picsum.photos/id/1025/800/600' },
  { label: 'Picsum 3', url: 'https://picsum.photos/id/1069/800/600' },
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
    <div className="flex flex-col gap-3">
      <label className="text-sm text-zinc-400">Image Source</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={src}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
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
                ? 'bg-indigo-600 border-indigo-500 text-white'
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
