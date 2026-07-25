import { type ReactNode } from "react";
import { gridToPx, type GridRect } from "../../lib/widgetGrid";

export default function WidgetSlot({
  layout,
  children,
}: {
  layout: GridRect;
  children: ReactNode;
}) {
  const { left, top, width, height } = gridToPx(layout);

  return (
    <div className="absolute z-0" style={{ left, top, width, height }}>
      {children}
    </div>
  );
}
