import { Area, AreaChart, CartesianGrid, ResponsiveContainer, YAxis } from 'recharts'

export interface ActivityPoint {
  period: string
  value: number
}

interface ActivityChartProps {
  data: ActivityPoint[]
  accessibleLabel: string
  emptyTitle: string
  emptyDescription: string
}

export function ActivityChart({ data, accessibleLabel, emptyTitle, emptyDescription }: ActivityChartProps) {
  return (
    <div className="analytics-chart" role="img" aria-label={accessibleLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={() => ''} axisLine={false} tickLine={false} />
          <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="var(--accent-bg)" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="chart-empty-label">
        <span>{emptyTitle}</span>
        <small>{emptyDescription}</small>
      </div>
    </div>
  )
}
