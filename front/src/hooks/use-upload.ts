import { toast } from '@components/ui/toast'
import { uploadBatchFile } from '@http/upload-batch-file'
import { uploadFile } from '@http/upload-file'
import { useState, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'

const ONE_KILOBYTE = 1024
const ONE_MEGABYTE = 1024 * ONE_KILOBYTE

export interface IUpload {
  file: File
  progress: number
}

export function useUpload() {
  const [uploads, setUploads] = useState<IUpload[]>([])
  const [isLoading, startTransition] = useTransition()
  const [allowMultiple, setAllowMultiple] = useState(false)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: allowMultiple,
    maxSize: ONE_MEGABYTE,
    onDrop: (acceptedFiles) => {
      const newUploads = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }))

      setUploads((prevFiles) =>
        allowMultiple ? [...prevFiles, ...newUploads] : newUploads,
      )
    },
  })

  function handleUpload() {
    startTransition(async () => {
      try {
        if (!uploads) {
          return
        }

        await uploadFile({
          onProgress: (progress) =>
            setUploads(([upload]) => [{ ...upload, progress }]),
          file: uploads[0].file,
        })

        toast.add({
          type: 'success',
          title: 'Upload realizado com sucesso!',
        })

        setUploads([])
      } catch {
        toast.add({
          type: 'error',
          title: 'Erro ao tentar fazer o upload do arquivo.',
        })
      }
    })
  }

  function handleMultipleUploads() {
    startTransition(async () => {
      try {
        if (!uploads.length) {
          return
        }

        await uploadBatchFile({
          uploads,
          onProgress: (progress: number, name: string) =>
            setUploads((prevUploads) =>
              prevUploads.map((upload) =>
                upload.file.name === name
                  ? {
                      ...upload,
                      progress,
                    }
                  : upload,
              ),
            ),
        })

        toast.add({
          type: 'success',
          title: 'Upload realizado com sucesso!',
        })

        setUploads([])
      } catch {
        toast.add({
          type: 'error',
          title: 'Erro ao tentar fazer o upload do arquivo.',
        })
      }
    })
  }

  return {
    uploads,
    isLoading,
    getRootProps,
    getInputProps,
    isDragActive,
    allowMultiple,
    setAllowMultiple,
    handleUpload: allowMultiple ? handleMultipleUploads : handleUpload,
  }
}
