import { useState } from 'react'
import { 
  FileText, Image, Video, Archive, Download, Share2, Trash2, 
  MoreVertical, Search, Filter, Grid, List, Upload as UploadIcon,
  Eye, Link, Star, StarOff
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { toast } from 'sonner'
import { formatFileSize, formatDate } from '../lib/utils'

interface FileItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'archive'
  size: number
  uploadedAt: string
  downloads: number
  isPublic: boolean
  isStarred: boolean
  thumbnail?: string
  sharedWith: string[]
}

const FileTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'image':
      return <Image className="w-5 h-5" />
    case 'video':
      return <Video className="w-5 h-5" />
    case 'archive':
      return <Archive className="w-5 h-5" />
    default:
      return <FileText className="w-5 h-5" />
  }
}

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project_Proposal_2024.pdf',
      type: 'document',
      size: 2048576,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      downloads: 12,
      isPublic: false,
      isStarred: true,
      sharedWith: ['team@ncq.sa']
    },
    {
      id: '2',
      name: 'team_photo.jpg',
      type: 'image',
      size: 1024000,
      uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      downloads: 8,
      isPublic: true,
      isStarred: false,
      sharedWith: [],
      thumbnail: 'https://picsum.photos/200/150?random=1'
    },
    {
      id: '3',
      name: 'presentation_video.mp4',
      type: 'video',
      size: 15728640,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 25,
      isPublic: true,
      isStarred: false,
      sharedWith: ['marketing@ncq.sa', 'sales@ncq.sa']
    },
    {
      id: '4',
      name: 'backup_files.zip',
      type: 'archive',
      size: 5242880,
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 3,
      isPublic: false,
      isStarred: true,
      sharedWith: []
    },
    {
      id: '5',
      name: 'Q1_Report.xlsx',
      type: 'document',
      size: 512000,
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 15,
      isPublic: false,
      isStarred: false,
      sharedWith: ['finance@ncq.sa']
    },
    {
      id: '6',
      name: 'product_demo.png',
      type: 'image',
      size: 2097152,
      uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      downloads: 20,
      isPublic: true,
      isStarred: false,
      sharedWith: [],
      thumbnail: 'https://picsum.photos/200/150?random=2'
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState('')

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleStar = (fileId: string) => {
    setFiles(files.map(file =>
      file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
    ))
    const file = files.find(f => f.id === fileId)
    toast.success(file?.isStarred ? 'Removed from favorites' : 'Added to favorites')
  }

  const deleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId))
    toast.success('File deleted successfully')
  }

  const downloadFile = (file: FileItem) => {
    toast.success(`Downloading ${file.name}...`)
    // Simulate download
    setTimeout(() => {
      toast.success(`${file.name} downloaded successfully`)
    }, 2000)
  }

  const shareFile = () => {
    if (selectedFile && shareEmail) {
      setFiles(files.map(file =>
        file.id === selectedFile.id 
          ? { ...file, sharedWith: [...file.sharedWith, shareEmail] }
          : file
      ))
      toast.success(`${selectedFile.name} shared with ${shareEmail}`)
      setShareDialogOpen(false)
      setShareEmail('')
      setSelectedFile(null)
    }
  }

  const copyPublicLink = (file: FileItem) => {
    const link = `https://files.ncq.sa/public/${file.id}`
    navigator.clipboard.writeText(link)
    toast.success('Public link copied to clipboard')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Files</h1>
          <p className="text-muted-foreground">Manage and share your files</p>
        </div>
        <Button>
          <UploadIcon className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Thumbnail or Icon */}
                <div className="relative mb-4 h-32 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" />
                  ) : (
                    <FileTypeIcon type={file.type} />
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur"
                      onClick={() => toggleStar(file.id)}
                    >
                      {file.isStarred ? (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <h3 className="font-medium truncate" title={file.name}>{file.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {file.isPublic && (
                        <Eye className="w-4 h-4 text-green-500" />
                      )}
                      {file.sharedWith.length > 0 && (
                        <Share2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => downloadFile(file)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedFile(file)
                          setShareDialogOpen(true)
                        }}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        {file.isPublic && (
                          <DropdownMenuItem onClick={() => copyPublicLink(file)}>
                            <Link className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteFile(file.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <FileTypeIcon type={file.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                        <span>{file.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.isPublic && (
                      <Eye className="w-4 h-4 text-green-500" />
                    )}
                    {file.sharedWith.length > 0 && (
                      <Share2 className="w-4 h-4 text-blue-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleStar(file.id)}
                    >
                      {file.isStarred ? (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => downloadFile(file)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedFile(file)
                          setShareDialogOpen(true)
                        }}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        {file.isPublic && (
                          <DropdownMenuItem onClick={() => copyPublicLink(file)}>
                            <Link className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteFile(file.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share {selectedFile?.name}</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to share this file with.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setShareDialogOpen(false)
                setShareEmail('')
              }}>
                Cancel
              </Button>
              <Button onClick={shareFile}>
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}