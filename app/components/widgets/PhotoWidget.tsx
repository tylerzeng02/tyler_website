import Image from "next/image";

export default function PhotoWidget({ src }: { src: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/30 ring-1 ring-black/10">
      <Image
        src={src}
        alt=""
        fill
        sizes="320px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}
