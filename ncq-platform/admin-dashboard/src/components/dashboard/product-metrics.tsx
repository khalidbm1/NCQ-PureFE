'use client'

import { Card } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  { product: 'Blockchain', usage: 4500, licenses: 42 },
  { product: 'IoT', usage: 3200, licenses: 38 },
  { product: 'LLM', usage: 2800, licenses: 25 },
  { product: 'Hospital', usage: 5100, licenses: 51 },
  { product: 'Payment', usage: 6300, licenses: 68 },
  { product: 'Smart Building', usage: 1900, licenses: 19 },
]

export function ProductMetrics() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Product Usage Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis 
            dataKey="product" 
            className="text-xs"
            tick={{ fill: '#6B7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
          <Bar 
            dataKey="usage" 
            fill="#3B82F6" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item) => (
          <div key={item.product} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.product}</span>
            <span className="font-medium">{item.licenses} licenses</span>
          </div>
        ))}
      </div>
    </Card>
  )
}