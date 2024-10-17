import clsx from "clsx";

export default function TableHeader({ className, children }) {
  return (
    <div className={clsx(["px-6 py-3 text-xs font-semibold text-light-smoke bg-obsidian uppercase tracking-wider flex-1", className])}>{children}</div>
  )
}