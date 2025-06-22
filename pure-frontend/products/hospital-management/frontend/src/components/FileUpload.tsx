import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Description,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Visibility,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { showNotification } from '../store/slices/notificationSlice';
import api from '../services/api';

interface FileUploadProps {
  open: boolean;
  onClose: () => void;
  category: string;
  subcategory?: string;
  entityId?: string;
  multiple?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
  onUploadSuccess?: (files: UploadedFile[]) => void;
  title?: string;
}

interface UploadedFile {
  id: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}

const FileUpload: React.FC<FileUploadProps> = ({
  open,
  onClose,
  category,
  subcategory,
  entityId,
  multiple = true,
  maxFiles = 10,
  acceptedFileTypes,
  maxSizeMB = 25,
  onUploadSuccess,
  title = 'Upload Files',
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const uploadController = useRef<AbortController | null>(null);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image color="primary" />;
    } else if (mimeType === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    } else if (mimeType.includes('document') || mimeType.includes('text')) {
      return <Description color="info" />;
    }
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }

    // Check file type if specified
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !acceptedFileTypes.includes(fileExtension)) {
        return `File type .${fileExtension} is not allowed`;
      }
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!multiple && acceptedFiles.length > 1) {
      dispatch(showNotification({
        message: 'Only one file can be uploaded at a time',
        severity: 'warning',
      }));
      return;
    }

    if (files.length + acceptedFiles.length > maxFiles) {
      dispatch(showNotification({
        message: `Maximum ${maxFiles} files allowed`,
        severity: 'warning',
      }));
      return;
    }

    const newFiles: FileWithProgress[] = [];
    
    for (const file of acceptedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        dispatch(showNotification({
          message: `${file.name}: ${validationError}`,
          severity: 'error',
        }));
        continue;
      }

      newFiles.push({
        file,
        progress: 0,
        status: 'pending',
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, [files.length, maxFiles, multiple, maxSizeMB, acceptedFileTypes, dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: maxFiles - files.length,
    disabled: uploading || uploadComplete,
  });

  const removeFile = (index: number) => {
    if (uploading) return;
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    uploadController.current = new AbortController();

    const uploadPromises = files.map(async (fileWithProgress, index) => {
      if (fileWithProgress.status === 'success') return;

      try {
        setFiles(prev => 
          prev.map((f, i) => 
            i === index ? { ...f, status: 'uploading', progress: 0 } : f
          )
        );

        const formData = new FormData();
        formData.append('file', fileWithProgress.file);
        formData.append('category', category);
        if (subcategory) {
          formData.append('subcategory', subcategory);
        }

        // Add entity-specific metadata
        const metadata: any = {};
        if (entityId) {
          if (category === 'patients') {
            metadata.patient_id = entityId;
          } else if (category === 'staff') {
            metadata.staff_id = entityId;
          } else if (category === 'lab_results') {
            metadata.test_id = entityId;
          }
        }
        formData.append('metadata', JSON.stringify(metadata));

        // Choose the appropriate endpoint
        let endpoint = '/api/files/upload';
        if (entityId) {
          if (category === 'patients') {
            endpoint = `/api/files/upload/patient/${entityId}`;
          } else if (category === 'staff') {
            endpoint = `/api/files/upload/staff/${entityId}`;
          } else if (category === 'lab_results') {
            endpoint = `/api/files/upload/lab-result/${entityId}`;
          }
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          signal: uploadController.current?.signal,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Upload failed');
        }

        const result = await response.json();

        setFiles(prev => 
          prev.map((f, i) => 
            i === index ? { 
              ...f, 
              status: 'success', 
              progress: 100, 
              uploadedFile: result.file_info 
            } : f
          )
        );

        return result.file_info;

      } catch (error: any) {
        if (error.name === 'AbortError') return;

        setFiles(prev => 
          prev.map((f, i) => 
            i === index ? { 
              ...f, 
              status: 'error', 
              error: error.message 
            } : f
          )
        );

        dispatch(showNotification({
          message: `Failed to upload ${fileWithProgress.file.name}: ${error.message}`,
          severity: 'error',
        }));
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];

      if (successfulUploads.length > 0) {
        dispatch(showNotification({
          message: `Successfully uploaded ${successfulUploads.length} file(s)`,
          severity: 'success',
        }));

        if (onUploadSuccess) {
          onUploadSuccess(successfulUploads);
        }

        setUploadComplete(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) {
      uploadController.current?.abort();
    }
    
    setFiles([]);
    setUploading(false);
    setUploadComplete(false);
    onClose();
  };

  const handleViewFile = (file: UploadedFile) => {
    window.open(file.url, '_blank');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!uploadComplete && (
          <Box sx={{ mb: 3 }}>
            <Paper
              {...getRootProps()}
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: uploading ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: uploading ? 'grey.300' : 'primary.main',
                  backgroundColor: uploading ? 'background.paper' : 'action.hover',
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or click to browse files
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max file size: {maxSizeMB}MB • Max files: {maxFiles}
                {acceptedFileTypes && (
                  <span> • Accepted: {acceptedFileTypes.join(', ')}</span>
                )}
              </Typography>
            </Paper>
          </Box>
        )}

        {files.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Files to Upload ({files.length})
            </Typography>
            <List>
              {files.map((fileWithProgress, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    {fileWithProgress.status === 'success' ? (
                      <CheckCircle color="success" />
                    ) : fileWithProgress.status === 'error' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      getFileIcon(fileWithProgress.file.type)
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={fileWithProgress.file.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {formatFileSize(fileWithProgress.file.size)}
                        </Typography>
                        {fileWithProgress.status === 'uploading' && (
                          <LinearProgress 
                            variant="indeterminate" 
                            sx={{ mt: 1, width: '100%' }} 
                          />
                        )}
                        {fileWithProgress.status === 'error' && fileWithProgress.error && (
                          <Typography variant="caption" color="error" display="block">
                            {fileWithProgress.error}
                          </Typography>
                        )}
                        {fileWithProgress.status === 'success' && (
                          <Chip 
                            label="Uploaded" 
                            size="small" 
                            color="success" 
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {fileWithProgress.status === 'success' && fileWithProgress.uploadedFile ? (
                      <IconButton 
                        onClick={() => handleViewFile(fileWithProgress.uploadedFile!)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    ) : (
                      <IconButton 
                        onClick={() => removeFile(index)}
                        size="small"
                        disabled={uploading}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {uploadComplete && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Upload completed successfully! You can now close this dialog.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          {uploadComplete ? 'Close' : 'Cancel'}
        </Button>
        {!uploadComplete && files.length > 0 && (
          <Button
            variant="contained"
            onClick={uploadFiles}
            disabled={uploading || files.every(f => f.status === 'success')}
            startIcon={<CloudUpload />}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileUpload;