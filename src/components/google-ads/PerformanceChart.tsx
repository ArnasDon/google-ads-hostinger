import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartPoint } from '../../types'

interface PerformanceChartProps {
  data: ChartPoint[]
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222225" />
          <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: '#18181a',
              border: '1px solid #2c2c30',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
            }}
            cursor={{ stroke: '#673de6', strokeOpacity: 0.4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#673de6"
            strokeWidth={2.5}
            dot={{ fill: '#673de6', r: 3 }}
            activeDot={{ r: 5 }}
            name="Clicks"
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ fill: '#22c55e', r: 3 }}
            activeDot={{ r: 5 }}
            name="Conversions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
