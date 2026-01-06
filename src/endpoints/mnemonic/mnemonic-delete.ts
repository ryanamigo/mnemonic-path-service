import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { AppContext } from "../../types";

export class MnemonicDelete extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonics"],
    summary: "Delete a Mnemonic",
    request: {
      params: z.object({
        id: Str(),
      }),
    },
    responses: {
      "200": {
        description: "Returns success",
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
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { id } = data.params;

    await c.env.mnemonic_db.prepare("DELETE FROM images WHERE id = ?").bind(id).run();

    return {
      success: true,
      result: {
        mnemonic: null,
      },
    };
  }
}
