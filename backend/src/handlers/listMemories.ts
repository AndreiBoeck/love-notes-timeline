import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getUserId } from "../lib/auth";
import { jsonResponse } from "../lib/response";
import { listMemories as listMemoryItems } from "../lib/dynamo";
import { buildPublicUrl } from "../lib/s3";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const userId = getUserId(event);
  if (!userId) {
    return jsonResponse(401, { message: "Unauthorized" });
  }

  const memories = await listMemoryItems(userId);

  // Sort by memoryDate descending, fallback to createdAt
  memories.sort((a, b) => (b.memoryDate || b.createdAt).localeCompare(a.memoryDate || a.createdAt));

  const enriched = memories.map((memory) => ({
    ...memory,
    fileUrl: buildPublicUrl(memory.fileKey),
  }));

  return jsonResponse(200, enriched);
};
