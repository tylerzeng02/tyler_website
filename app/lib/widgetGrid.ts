export const CELL = 40;
export const GAP = 8;
export const PITCH = CELL + GAP;

// Absolutely positioned children ignore their containing block's padding
// (the CSS spec anchors them to the padding edge, not the content edge), so
// the gap between the widget cluster and the page border has to be applied
// explicitly here — using the same value as the inter-widget gap.
export const MARGIN = GAP;

export type GridRect = { col: number; row: number; w: number; h: number };

export function gridToPx({ col, row, w, h }: GridRect) {
  return {
    left: MARGIN + col * PITCH,
    top: MARGIN + row * PITCH,
    width: w * CELL + (w - 1) * GAP,
    height: h * CELL + (h - 1) * GAP,
  };
}
