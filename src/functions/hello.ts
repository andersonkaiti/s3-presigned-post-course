import { response } from '@shared/utils/response.ts'

export async function handler() {
  return response({
    statusCode: 200,
    body: {
      message: 'Hello, World!',
    },
  })
}
