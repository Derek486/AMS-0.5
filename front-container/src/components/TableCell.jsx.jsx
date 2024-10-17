import clsx from "clsx"

export default function TableCell({ className, children }) {
  return (
    <div className={clsx(["px-6 py-4 text-sm whitespace-nowrap text-midnight font-normal truncate flex-1 flex items-center", className])}>{children}</div>
  )
}