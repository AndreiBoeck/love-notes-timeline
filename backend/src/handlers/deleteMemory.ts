import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getUserId } from "../lib/auth";
import { jsonResponse } from "../lib/response";
import { deleteMemory as removeMemory, getMemory } from "../lib/dynamo";
import { deleteObject } from "../lib/s3";

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

  const existing = await getMemory(userId, memoryId);
  if (!existing) {
    return jsonResponse(404, { message: "Memory not found" });
  }

  await removeMemory(userId, memoryId);
  await deleteObject(existing.fileKey);

  return jsonResponse(200, { message: "Memory deleted" });
};
