import { z } from "zod";

export const UploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  persona: z.string().optional(),
  file: z.any(),
});
