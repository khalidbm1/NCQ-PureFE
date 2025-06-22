import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Upload,
  Download,
  Eye,
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Plus,
  FileIcon,
  Image,
  Video,
  Archive,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuthStore } from '../stores/auth'
import { formatFileSize, formatDate } from '../lib/utils'

interface RecentFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'archive'
  size: number
  uploadedAt: string
  downloads: number
  isPublic: boolean
}

interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon: any
  color: string
}

const StatCard = ({ title, value, change, changeType, icon: Icon, color }: StatCard) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 ${colorClasses[color as keyof typeof colorClasses]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className={`w-3 h-3 mr-1 ${
              changeType === 'increase' ? 'text-green-500' : 
              changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'
            }`} />
            <span className={
              changeType === 'increase' ? 'text-green-600' : 
              changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const FileTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'image':
      return <Image className="w-4 h-4" />
    case 'video':
      return <Video className="w-4 h-4" />
    case 'archive':
      return <Archive className="w-4 h-4" />
    default:
      return <FileIcon className="w-4 h-4" />
  }
}

export default function Dashboard() {
  const { user } = useAuthStore()
  
  const [recentFiles] = useState<RecentFile[]>([
    {
      id: '1',
      name: 'Project_Proposal_2024.pdf',
      type: 'document',
      size: 2048576,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      downloads: 12,
      isPublic: false,
    },
    {
      id: '2',
      name: 'team_photo.jpg',
      type: 'image',
      size: 1024000,
      uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      downloads: 8,
      isPublic: true,
    },
    {
      id: '3',
      name: 'presentation_video.mp4',
      type: 'video',
      size: 15728640,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 25,
      isPublic: true,
    },
    {
      id: '4',
      name: 'backup_files.zip',
      type: 'archive',
      size: 5242880,
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 3,
      isPublic: false,
    },
  ])

  const stats = [
    {
      title: 'Total Files',
      value: user?.stats?.filesUploaded || 0,
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Storage Used',
      value: formatFileSize((user?.stats?.storageUsed || 0) * 1024 * 1024),
      change: '+8%',
      changeType: 'increase' as const,
      icon: BarChart3,
      color: 'green',
    },
    {
      title: 'Downloads',
      value: recentFiles.reduce((acc, file) => acc + file.downloads, 0),
      change: '+23%',
      changeType: 'increase' as const,
      icon: Download,
      color: 'purple',
    },
    {
      title: 'API Calls',
      value: user?.stats?.apiCalls || 0,
      change: '+5%',
      changeType: 'increase' as const,
      icon: Clock,
      color: 'yellow',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.profile?.firstName || user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your files and account.
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Files */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Files</CardTitle>
              <Link to="/files">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <FileTypeIcon type={file.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                      <span>•</span>
                      <span>{file.downloads} downloads</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {file.isPublic && (
                      <Eye className="w-3 h-3 text-green-500" />
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link to="/upload">
                <Button variant="outline" className="justify-start h-auto p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <Upload className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Upload Files</div>
                      <div className="text-sm text-muted-foreground">
                        Drag and drop or browse files
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/api-keys">
                <Button variant="outline" className="justify-start h-auto p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <Plus className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Create API Key</div>
                      <div className="text-sm text-muted-foreground">
                        Generate new API access key
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/team">
                <Button variant="outline" className="justify-start h-auto p-4 w-full">
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Invite Team Members</div>
                      <div className="text-sm text-muted-foreground">
                        Share access with your team
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Subscription</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.subscription?.plan || 'Free'} Plan
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(((user?.stats?.storageUsed || 0) / 1024) * 100)}% used
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground">
                  {user?.emailVerified ? 'Verified' : 'Pending verification'}
                </p>
              </div>
            </div>
          </div>

          {!user?.emailVerified && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please verify your email address to unlock all features.{' '}
                <Button variant="link" className="p-0 h-auto text-yellow-800 dark:text-yellow-200">
                  Resend verification email
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}