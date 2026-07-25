"use client";

import { useEffect, useState } from "react";

const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKDAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function monthGrid(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function CalendarWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setNow(new Date()));
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  if (!now) {
    return (
      <div className="h-full w-full rounded-2xl bg-[#1c1c1e] shadow-xl shadow-black/30 ring-1 ring-black/10" />
    );
  }

  const today = now.getDate();
  const weeks = monthGrid(now);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#1c1c1e] p-2.5 text-white shadow-xl shadow-black/30 ring-1 ring-black/10">
      <div className="flex items-start justify-between leading-none">
        <div>
          <div className="text-[7px] font-semibold tracking-wide text-red-500">
            {WEEKDAY_NAMES[now.getDay()]}
          </div>
          <div className="mt-0.5 text-base font-bold leading-none">{today}</div>
        </div>
        <div className="text-right text-[7px] font-semibold tracking-wide text-zinc-400">
          {MONTH_NAMES[now.getMonth()]}
        </div>
      </div>

      <table className="mt-1 w-full flex-1 table-fixed border-collapse text-center text-[5px] leading-none">
        <thead>
          <tr className="text-zinc-500">
            {WEEKDAY_LETTERS.map((l, i) => (
              <th key={i} className="pb-0.5 font-medium">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((day, j) => (
                <td key={j} className="p-0">
                  {day && (
                    <span
                      className={`inline-flex h-2 w-2 items-center justify-center rounded-full ${
                        day === today
                          ? "bg-red-500 font-semibold text-white"
                          : "text-zinc-300"
                      }`}
                    >
                      {day}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-0.5 truncate text-[6px] text-zinc-500">
        No events today
      </div>
    </div>
  );
}
