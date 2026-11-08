import type { IUpload } from '@hooks/use-upload'
import axios from 'axios'
import { getPresignedBatchPOST } from './get-presigned-batch-post'

interface IUploadFileParams {
  uploads: IUpload[]
  onProgress: (progress: number, name: string) => void
}

export async function uploadBatchFile({
  uploads,
  onProgress,
}: IUploadFileParams) {
  const { url, fields } = await getPresignedBatchPOST(
    uploads.map((upload) => upload.file),
  )

  await Promise.allSettled(
    uploads.map(async (upload) => {
      const formData = new FormData()

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value)
      })

      formData.set('key', `${window.crypto.randomUUID()}-${upload.file.name}`)
      formData.append('file', upload.file)

      await axios.post(url, formData, {
        onUploadProgress: ({ total, loaded }) =>
          onProgress(
            Math.round((loaded * 100) / Number(total)),
            upload.file.name,
          ),
      })
    }),
  )
}
