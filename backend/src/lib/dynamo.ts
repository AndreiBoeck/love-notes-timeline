import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Memory } from "../models/memory";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TableName = process.env.MEMORIES_TABLE as string;

export async function putMemory(memory: Memory) {
  await docClient.send(
    new PutCommand({
      TableName,
      Item: memory,
    })
  );
  return memory;
}

export async function getMemory(userId: string, id: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName,
      Key: { userId, id },
    })
  );
  return result.Item as Memory | undefined;
}

export async function listMemories(userId: string) {
  const result = await docClient.send(
    new QueryCommand({
      TableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );
  return (result.Items as Memory[] | undefined) ?? [];
}

export async function deleteMemory(userId: string, id: string) {
  await docClient.send(
    new DeleteCommand({
      TableName,
      Key: { userId, id },
    })
  );
}
