import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { getUserId } from "../lib/auth";
import { jsonResponse } from "../lib/response";
import { putMemory } from "../lib/dynamo";
import { buildPublicUrl } from "../lib/s3";
import { CreateMemoryInput, Memory } from "../models/memory";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const userId = getUserId(event);
  if (!userId) {
    return jsonResponse(401, { message: "Unauthorized" });
  }

  if (!event.body) {
    return jsonResponse(400, { message: "Missing request body" });
  }

  let payload: CreateMemoryInput;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return jsonResponse(400, { message: "Invalid JSON body" });
  }

  const { fileKey, memoryDate, title, description, contentType } = payload;

  if (!fileKey || !memoryDate || !title) {
    return jsonResponse(400, { message: "fileKey, memoryDate, and title are required" });
  }

  const parsedDate = new Date(memoryDate);
  if (isNaN(parsedDate.getTime())) {
    return jsonResponse(400, { message: "memoryDate must be a valid date string" });
  }

  const memory: Memory = {
    id: uuidv4(),
    userId,
    fileKey,
    createdAt: new Date().toISOString(),
    memoryDate: parsedDate.toISOString(),
    title,
    description,
    contentType,
  };

  await putMemory(memory);

  return jsonResponse(201, { ...memory, fileUrl: buildPublicUrl(fileKey) });
};
