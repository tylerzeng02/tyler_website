const TYLERS_WORLD = `888             888                  d8b                                             888      888
888             888                  88P                                             888      888
888             888                  8P                                              888      888
888888 888  888 888  .d88b.  888d888 "  .d8888b       888  888  888  .d88b.  888d888 888  .d88888
888    888  888 888 d8P  Y8b 888P"      88K           888  888  888 d88""88b 888P"   888 d88" 888
888    888  888 888 88888888 888        "Y8888b.      888  888  888 888  888 888     888 888  888
Y88b.  Y88b 888 888 Y8b.     888             X88      Y88b 888 d88P Y88..88P 888     888 Y88b 888
 "Y888  "Y88888 888  "Y8888  888         88888P'       "Y8888888P"   "Y88P"  888     888  "Y88888
            888
       Y8b d88P
        "Y88P"                                                                                    `;

export default function AsciiLogo() {
  return (
    <pre
      className="w-fit overflow-x-auto font-mono leading-[1.15]"
      style={{
        color: "var(--accent)",
        textShadow: "0 0 24px color-mix(in srgb, var(--accent) 35%, transparent)",
        fontSize: "clamp(5px, 1.25vw, 10.5px)",
      }}
    >
      {TYLERS_WORLD}
    </pre>
  );
}
