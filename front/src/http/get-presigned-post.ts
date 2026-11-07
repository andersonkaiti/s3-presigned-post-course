import { httpClient } from './http-client'

interface IGetPresignedPOSTParams extends File {}

interface IGetPresignedPOSTResponse {
  url: string
  fields: Record<string, string>
}

export async function getPresignedPOST({
  name: filename,
  size: filesize,
}: IGetPresignedPOSTParams): Promise<IGetPresignedPOSTResponse> {
  const { data } = await httpClient.post<IGetPresignedPOSTResponse>('/', {
    filename,
    filesize,
  })

  return data
}
