import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getUserId } from "../lib/auth";
import { jsonResponse } from "../lib/response";
import { getMemory as fetchMemory } from "../lib/dynamo";
import { buildPublicUrl } from "../lib/s3";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const userId = getUserId(event);
  if (!userId) {
    return jsonResponse(401, { message: "Unauthorized" });
  }

  const memoryId = event.pathParameters?.id;
  if (!memoryId) {
    return jsonResponse(400, { message: "Memory id is required" });
  }

  const memory = await fetchMemory(userId, memoryId);
  if (!memory) {
    return jsonResponse(404, { message: "Memory not found" });
  }

  return jsonResponse(200, { ...memory, fileUrl: buildPublicUrl(memory.fileKey) });
};
