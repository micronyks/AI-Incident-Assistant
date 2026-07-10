// =============================================================================
// FILE DROPZONE COMPONENT
// =============================================================================
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { motion, AnimatePresence } from 'framer-motion';
import { FILE_UPLOAD_CONFIG } from '@/constants';
import type { FileWithPreview } from '@/types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function FileDropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileWithPreview[] = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: `${file.name}-${Date.now()}`,
      }),
    );
    setFiles((prev) => [...prev, ...newFiles].slice(0, FILE_UPLOAD_CONFIG.maxFiles));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: FILE_UPLOAD_CONFIG.acceptedTypes,
    maxSize: FILE_UPLOAD_CONFIG.maxSizeBytes,
    maxFiles: FILE_UPLOAD_CONFIG.maxFiles,
  });

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 500 }}>
        Attachments{' '}
        <Typography component="span" variant="caption" color="text.disabled">
          (optional · max {FILE_UPLOAD_CONFIG.maxFiles} files · 10MB each)
        </Typography>
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: isDragActive ? '2px dashed #6366f1' : '2px dashed rgba(255,255,255,0.1)',
          borderRadius: '12px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: 'rgba(99, 102, 241, 0.5)', background: 'rgba(99, 102, 241, 0.05)' },
        }}
      >
        <input {...getInputProps()} />
        <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CloudUploadIcon sx={{ fontSize: 36, color: isDragActive ? 'primary.main' : 'text.disabled', mb: 1 }} />
        </motion.div>
        <Typography variant="body2" color={isDragActive ? 'primary.main' : 'text.secondary'}>
          {isDragActive ? 'Release to upload' : 'Drag & drop files here, or click to select'}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Supports: JPG, PNG, GIF, WebP, PDF
        </Typography>
      </Box>

      {fileRejections.length > 0 && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {fileRejections[0].errors[0].message}
        </Typography>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  {file.type.startsWith('image/') ? (
                    <Box
                      component="img"
                      src={file.preview}
                      alt={file.name}
                      sx={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 80, height: 80,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 0.5, p: 1,
                      }}
                    >
                      <InsertDriveFileIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '0.6rem', textAlign: 'center', color: 'text.secondary' }}
                        noWrap
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                  <Chip
                    label={formatBytes(file.size)}
                    size="small"
                    sx={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.6rem', height: 18, background: 'rgba(0,0,0,0.7)', color: 'white' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeFile(file.id)}
                    sx={{
                      position: 'absolute', top: 2, right: 2,
                      background: 'rgba(0,0,0,0.7)', color: 'white', p: 0.25,
                      '&:hover': { background: '#ef4444' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </IconButton>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}
