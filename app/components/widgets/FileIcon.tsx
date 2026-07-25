import Image from "next/image";

export default function FileIcon({
  label,
  thumbnail,
  onOpen,
  setRef,
}: {
  label: string;
  thumbnail: string;
  onOpen: () => void;
  setRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={setRef}
      type="button"
      onClick={onOpen}
      className="flex w-24 flex-col items-center gap-1.5 rounded-md p-2 text-center transition-colors hover:bg-white/20"
    >
      <div className="relative h-16 w-[52px] overflow-hidden rounded-[3px] shadow-lg ring-1 ring-black/15">
        <Image src={thumbnail} alt="" fill sizes="52px" className="object-cover" />
      </div>
      <span className="line-clamp-2 text-[11px] leading-tight text-zinc-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.6)]">
        {label}
      </span>
    </button>
  );
}
