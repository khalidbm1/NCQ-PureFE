'use client'

import { Card } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'

const data = [
  { name: 'Jan', revenue: 4000, licenses: 240, users: 2400 },
  { name: 'Feb', revenue: 3000, licenses: 221, users: 2210 },
  { name: 'Mar', revenue: 2000, licenses: 229, users: 2290 },
  { name: 'Apr', revenue: 2780, licenses: 200, users: 2000 },
  { name: 'May', revenue: 1890, licenses: 218, users: 2181 },
  { name: 'Jun', revenue: 2390, licenses: 250, users: 2500 },
  { name: 'Jul', revenue: 3490, licenses: 310, users: 3100 },
]

export function Overview() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="name" 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="licenses" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}