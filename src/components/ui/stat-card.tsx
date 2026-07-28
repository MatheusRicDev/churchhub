import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "./card"

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  growth?: number
}

export function StatCard({ icon, value, label, growth }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
          {icon}
        </div>
        {growth !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              growth >= 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {growth >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(growth)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {value}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          {label}
        </p>
      </div>
    </Card>
  )
}
