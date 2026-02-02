import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";
import { verify } from "hono/jwt";
import { success } from "../../utils/response";

export class MnemonicDelete extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonic"],
    summary: "Delete a mnemonic",
    request: {
      params: z.object({
        id: Str({ description: "Mnemonic ID" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns true if deleted",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                mnemonic: z.null(),
              }),
            }),
          },
        },
      },
      "401": {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              error: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const headerToken = c.req.header("Authorization");
    if (!headerToken) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const env = c.env;
    try {
      await verify(headerToken, env.JWT_SECRET);
    } catch (e) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    const data = await this.getValidatedData<typeof this.schema>();
    const { id } = data.params;

    await c.env.mnemonic_db.prepare("DELETE FROM images WHERE id = ?").bind(id).run();

    return success()
  }
}
