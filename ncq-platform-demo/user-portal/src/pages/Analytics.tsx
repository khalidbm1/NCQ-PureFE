import { useState } from 'react'
import { 
  BarChart3, TrendingUp, Download, Eye, FileText, 
  Calendar, Filter, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { formatFileSize } from '../lib/utils'

// Mock data for charts
const generateMockData = (days: number) => {
  const data = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      downloads: Math.floor(Math.random() * 100) + 20,
      uploads: Math.floor(Math.random() * 50) + 10,
      views: Math.floor(Math.random() * 200) + 50,
      bandwidth: Math.floor(Math.random() * 500) + 100
    })
  }
  return data
}

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease'
  icon: any
}

const MetricCard = ({ title, value, change, changeType, icon: Icon }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {changeType === 'increase' ? (
            <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
          )}
          <span className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  )
}

const SimpleBarChart = ({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) => {
  const max = Math.max(...data.map(d => d[dataKey]))
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground w-12">{item.date}</span>
          <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full ${color} transition-all duration-500`}
              style={{ width: `${(item[dataKey] / max) * 100}%` }}
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium">
              {item[dataKey]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7')
  const [refreshing, setRefreshing] = useState(false)
  
  const data = generateMockData(parseInt(dateRange))
  
  const totalDownloads = data.reduce((acc, d) => acc + d.downloads, 0)
  const totalUploads = data.reduce((acc, d) => acc + d.uploads, 0)
  const totalViews = data.reduce((acc, d) => acc + d.views, 0)
  const totalBandwidth = data.reduce((acc, d) => acc + d.bandwidth, 0)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const popularFiles = [
    { name: 'Q4_Report_2024.pdf', downloads: 342, size: 2.4 * 1024 * 1024 },
    { name: 'product_demo_video.mp4', downloads: 289, size: 45.7 * 1024 * 1024 },
    { name: 'marketing_assets.zip', downloads: 234, size: 128 * 1024 * 1024 },
    { name: 'team_photo_2024.jpg', downloads: 198, size: 3.2 * 1024 * 1024 },
    { name: 'API_documentation.pdf', downloads: 176, size: 1.8 * 1024 * 1024 }
  ]

  const fileTypes = [
    { type: 'Documents', count: 156, percentage: 45 },
    { type: 'Images', count: 98, percentage: 28 },
    { type: 'Videos', count: 54, percentage: 16 },
    { type: 'Archives', count: 38, percentage: 11 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your file sharing and storage metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Downloads"
          value={totalDownloads.toLocaleString()}
          change={12}
          changeType="increase"
          icon={Download}
        />
        <MetricCard
          title="File Views"
          value={totalViews.toLocaleString()}
          change={8}
          changeType="increase"
          icon={Eye}
        />
        <MetricCard
          title="Files Uploaded"
          value={totalUploads.toLocaleString()}
          change={-3}
          changeType="decrease"
          icon={FileText}
        />
        <MetricCard
          title="Bandwidth Used"
          value={`${(totalBandwidth / 1000).toFixed(1)} GB`}
          change={15}
          changeType="increase"
          icon={BarChart3}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="downloads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="bandwidth">Bandwidth</TabsTrigger>
        </TabsList>

        <TabsContent value="downloads">
          <Card>
            <CardHeader>
              <CardTitle>Download Trends</CardTitle>
              <CardDescription>
                Number of file downloads over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={data} dataKey="downloads" color="bg-blue-500" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads">
          <Card>
            <CardHeader>
              <CardTitle>Upload Activity</CardTitle>
              <CardDescription>
                Files uploaded to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={data} dataKey="uploads" color="bg-green-500" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>File Views</CardTitle>
              <CardDescription>
                How often your files are being viewed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={data} dataKey="views" color="bg-purple-500" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bandwidth">
          <Card>
            <CardHeader>
              <CardTitle>Bandwidth Usage</CardTitle>
              <CardDescription>
                Data transfer in MB per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={data} dataKey="bandwidth" color="bg-orange-500" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Files */}
        <Card>
          <CardHeader>
            <CardTitle>Most Downloaded Files</CardTitle>
            <CardDescription>
              Your top performing content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{file.downloads}</p>
                    <p className="text-xs text-muted-foreground">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>File Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of your stored files by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fileTypes.map((type, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{type.type}</span>
                    <span className="text-muted-foreground">{type.count} files</span>
                  </div>
                  <Progress value={type.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Files</span>
                <span className="font-medium">346</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}