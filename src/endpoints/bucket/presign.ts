import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from 'zod'
import { AppContext } from "../../types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class Presign extends OpenAPIRoute {
  schema = {
    tags: ["Bucket"],
    summary: "Create a presigned URL",
    request: {
      query: z.object({
        fileName: Str(),
      }),
    },
    responses: {
      "200": {
        description: "Returns a presigned URL",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                url: Str(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { fileName } = data.query;

    // Cast env to include R2 credentials which are regular env vars/secrets
    const env = c.env

    const S3 = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });

    const url = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: "mnemonic-path",
        Key: fileName,
      }),
      { expiresIn: 3600 }
    );

    return {
      success: true,
      result: {
        url: url
      },
    };
  }
}