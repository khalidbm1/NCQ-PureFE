import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload as UploadIcon, X, FileText, Image, Video, Archive,
  CheckCircle, AlertCircle, Loader2, Cloud, HardDrive,
  Globe, Lock, Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { toast } from 'sonner'
import { formatFileSize } from '../lib/utils'

interface UploadFile {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) return <Image className="w-5 h-5" />
  if (type.startsWith('video/')) return <Video className="w-5 h-5" />
  if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />
  return <FileText className="w-5 h-5" />
}

export default function Upload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [storageLocation, setStorageLocation] = useState('cloud')
  const [isPublic, setIsPublic] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'text/*': ['.txt', '.md'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/msword': ['.doc', '.docx']
    }
  })

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const startUpload = async () => {
    setUploading(true)
    
    for (const fileItem of files) {
      if (fileItem.status === 'completed') continue
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id ? { ...f, status: 'uploading' } : f
      ))

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, progress } : f
        ))
      }

      // Randomly simulate success or error (90% success rate)
      const success = Math.random() > 0.1
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { 
              ...f, 
              status: success ? 'completed' : 'error',
              error: success ? undefined : 'Network error occurred'
            } 
          : f
      ))

      if (success) {
        toast.success(`${fileItem.file.name} uploaded successfully`)
      } else {
        toast.error(`Failed to upload ${fileItem.file.name}`)
      }
    }

    setUploading(false)
  }

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0)
  const completedFiles = files.filter(f => f.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Upload Files</h1>
        <p className="text-muted-foreground">
          Drag and drop your files or click to browse
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dropzone */}
          <Card>
            <CardContent className="p-0">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200 
                  ${isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Drop files here' : 'Drop files here or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Support for images, videos, documents and archives
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Files to Upload</CardTitle>
                <CardDescription>
                  {files.length} file{files.length !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {files.map((fileItem) => (
                  <div key={fileItem.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                      <FileIcon type={fileItem.file.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileItem.file.size)}
                      </p>
                      {fileItem.status === 'uploading' && (
                        <Progress value={fileItem.progress} className="h-1 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {fileItem.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeFile(fileItem.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      {fileItem.status === 'uploading' && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )}
                      {fileItem.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Storage Location */}
          <Card>
            <CardHeader>
              <CardTitle>Storage Location</CardTitle>
              <CardDescription>
                Choose where to store your files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={storageLocation} onValueChange={setStorageLocation}>
                <div className="flex items-start space-x-3 mb-3">
                  <RadioGroupItem value="cloud" id="cloud" className="mt-1" />
                  <Label htmlFor="cloud" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Cloud className="w-4 h-4" />
                      <span className="font-medium">Cloud Storage</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fast, secure, accessible anywhere
                    </p>
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="local" id="local" className="mt-1" />
                  <Label htmlFor="local" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4" />
                      <span className="font-medium">Local Storage</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stored on your dedicated server
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can access your files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <Label htmlFor="public">Make files public</Label>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              {isPublic && (
                <p className="text-sm text-muted-foreground">
                  Files will be accessible via a public link
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upload Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total files</span>
                <span className="font-medium">{files.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total size</span>
                <span className="font-medium">{formatFileSize(totalSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{completedFiles} / {files.length}</span>
              </div>
              <Button 
                className="w-full" 
                disabled={files.length === 0 || uploading}
                onClick={startUpload}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Start Upload
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}