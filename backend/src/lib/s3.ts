import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});
const Bucket = process.env.BUCKET_NAME as string;

export async function createPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
  return uploadUrl;
}

export async function deleteObject(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket, Key: key }));
}

export function buildPublicUrl(key: string) {
  return `https://${Bucket}.s3.amazonaws.com/${key}`;
}
