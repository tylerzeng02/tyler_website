export default function PdfViewerApp({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      title="HL Physics.pdf"
      className="h-full w-full rounded-md border-0 bg-zinc-800"
    />
  );
}
