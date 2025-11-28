export interface Memory {
  id: string;
  userId: string;
  fileKey: string;
  createdAt: string;
  memoryDate: string;
  title: string;
  description?: string;
  contentType?: string;
}

export interface CreateMemoryInput {
  fileKey: string;
  memoryDate: string;
  title: string;
  description?: string;
  contentType?: string;
}
