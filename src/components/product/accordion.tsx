import { CaretIcon } from "@/components/icons"

/** blocks/accordion with caret icon and dividers, using native <details>. */
export function Accordion({ rows }: { rows: { heading: string; content?: string }[] }) {
  return (
    <div className="border-t border-border">
      {rows.map((row) => (
        <details key={row.heading} className="group border-b border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between min-h-11 py-[11.2px] [&::-webkit-details-marker]:hidden">
            <span>{row.heading}</span>
            <CaretIcon className="size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <p className="whitespace-pre-line pb-4 text-[0.75rem] leading-[1.4] tracking-[-0.5px]">{row.content}</p>
        </details>
      ))}
    </div>
  )
}
