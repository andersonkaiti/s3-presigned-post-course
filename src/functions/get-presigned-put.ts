import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from '@clients/s3.client.ts'
import { env } from '@shared/config/env.ts'
import { parseEvent } from '@shared/utils/parse-event.ts'
import { response } from '@shared/utils/response.ts'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { z } from 'zod'

const ONE_MINUTE = 60
const TEN_MINUTES = 10 * ONE_MINUTE

const ONE_KILOBYTE = 1024
const ONE_MEGABYTE = 1024 * ONE_KILOBYTE

const getPresignedPUTSchema = z.object({
  filename: z
    .string()
    .refine(
      (value) => extname(value).length > 0,
      'The file must have an extension',
    ),
  filesize: z
    .number()
    .refine(
      (value) => value < ONE_MEGABYTE,
      'The file must have less than 1 MB',
    ),
})

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, error, data } = getPresignedPUTSchema.safeParse(
    parseEvent(event).body,
  )

  if (!success) {
    return response({
      statusCode: 400,
      body: {
        error: z.treeifyError(error),
      },
    })
  }

  const { filename } = data

  const command = new PutObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: `${randomUUID()}${filename}`,
  })

  const signedURL = await getSignedUrl(s3Client, command, {
    expiresIn: TEN_MINUTES,
  })

  return response({
    statusCode: 200,
    body: {
      signedURL,
    },
  })
}
