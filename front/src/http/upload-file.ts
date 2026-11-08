import axios from 'axios'
import { getPresignedPOST } from './get-presigned-post'

interface IUploadFileParams {
  onProgress: (progress: number) => void
  file: File
}

export async function uploadFile({ onProgress, file }: IUploadFileParams) {
  const { url, fields } = await getPresignedPOST(file)

  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value)
  })

  formData.append('file', file)

  await axios.post(url, formData, {
    onUploadProgress: ({ total, loaded }) =>
      onProgress(Math.round((loaded * 100) / Number(total))),
  })
}
