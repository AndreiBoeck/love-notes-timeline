import { APIGatewayProxyEventV2 } from "aws-lambda";

export function getUserId(event: APIGatewayProxyEventV2): string | undefined {
  const authorizer = event.requestContext.authorizer;
  const claims = (authorizer as any)?.jwt?.claims || (authorizer as any)?.claims;
  return claims?.sub || claims?.["cognito:username"];
}
