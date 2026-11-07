import { toast } from '@components/ui/toast'
import { uploadFile } from '@http/upload-file'
import { useState, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'

const ONE_KILOBYTE = 1024
const ONE_MEGABYTE = 1024 * ONE_KILOBYTE

export function useUpload() {
  const [file, setFile] = useState<File>()
  const [isLoading, startTransition] = useTransition()
  const [progress, setProgress] = useState(0)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxSize: ONE_MEGABYTE,
    onDrop: ([acceptedFile]) => {
      setFile(acceptedFile)
    },
  })

  function handleUpload() {
    startTransition(async () => {
      try {
        if (!file) {
          return
        }

        await uploadFile({
          onProgress: setProgress,
          file,
        })

        toast.add({
          type: 'success',
          title: 'Upload realizado com sucesso!',
        })

        setProgress(0)
        setFile(undefined)
      } catch {
        toast.add({
          type: 'error',
          title: 'Erro ao tentar fazer o upload do arquivo.',
        })
      }
    })
  }

  return {
    file,
    isLoading,
    progress,
    getRootProps,
    getInputProps,
    isDragActive,
    handleUpload,
  }
}
