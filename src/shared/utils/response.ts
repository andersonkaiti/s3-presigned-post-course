import type { Http } from '@app-types/http.d.ts'
import type { APIGatewayProxyResultV2 } from 'aws-lambda'

export function response({
  statusCode = 200,
  body = {},
  headers = {},
}: Http.Response): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  }
}
