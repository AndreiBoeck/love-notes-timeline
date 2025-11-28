import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { createPresignedUrl } from "../lib/s3";
import { jsonResponse } from "../lib/response";
import { getUserId } from "../lib/auth";

interface PresignRequest {
  filename: string;
  contentType: string;
}

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

  let payload: PresignRequest;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return jsonResponse(400, { message: "Invalid JSON body" });
  }

  const { filename, contentType } = payload;
  if (!filename || !contentType) {
    return jsonResponse(400, { message: "filename and contentType are required" });
  }

  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileKey = `${userId}/${Date.now()}-${uuidv4()}-${safeName}`;
  const uploadUrl = await createPresignedUrl(fileKey, contentType);

  return jsonResponse(200, { uploadUrl, fileKey });
};
