import type { ReactNode } from "react"

interface Column {
  key: string
  header: string
  render?: (item: Record<string, unknown>) => ReactNode
  className?: string
}

interface TableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  onRowClick?: (item: Record<string, unknown>) => void
}

export function Table({
  columns,
  data,
  onRowClick,
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider pb-3 px-3 first:pl-0 last:pr-0 ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {data.map((item, index) => (
            <tr
              key={(item.id as string) || index}
              onClick={() => onRowClick?.(item)}
              className={`${onRowClick ? "cursor-pointer" : ""} hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-3 first:pl-0 last:pr-0 text-sm text-neutral-700 dark:text-neutral-300 ${col.className || ""}`}
                >
                  {col.render
                    ? col.render(item)
                    : (item[col.key] as ReactNode) || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-sm text-neutral-400">
          Nenhum registro encontrado
        </div>
      )}
    </div>
  )
}
