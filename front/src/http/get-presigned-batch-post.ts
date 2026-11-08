import { httpClient } from './http-client'

interface IGetPresignedPOSTParams extends Array<File> {}

interface IGetPresignedPOSTResponse {
  url: string
  fields: Record<string, string>
}

export async function getPresignedBatchPOST(
  files: IGetPresignedPOSTParams,
): Promise<IGetPresignedPOSTResponse> {
  const { data } = await httpClient.post<IGetPresignedPOSTResponse>('/batch', {
    files: files.map((file) => ({
      filename: `${window.crypto.randomUUID()}-${file.name}`,
      filesize: file.size,
    })),
  })

  return data
}
