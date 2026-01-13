import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext, Mnemonic, MnemonicCreateParams } from "../../types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export class MnemonicCreate extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonic"],
    summary: "Create a new mnemonic",
    request: {
      body: {
        content: {
          "application/json": {
            schema: MnemonicCreateParams,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the created mnemonic",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                mnemonic: Mnemonic
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
    const authSession = getCookie(c, "auth_session");
    if (!authSession) {
      return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    const env = c.env;
    try {
      await verify(authSession, env.JWT_SECRET);
    } catch (e) {
      return c.json({ success: false, error: "Invalid token" }, 401);
    }

    const data = await this.getValidatedData<typeof this.schema>();
    const mnemonic = data.body;
    const id = crypto.randomUUID();
    const now = Date.now();

    await c.env.mnemonic_db.prepare(`
			INSERT INTO images (
				id, url, width, height, size, mime_type,
				make, model, date_time_original, exposure_time, f_number, iso_speed_ratings, focal_length, lens_model,
				latitude, longitude, altitude,
				created_at, updated_at
			) VALUES (
				?, ?, ?, ?, ?, ?,
				?, ?, ?, ?, ?, ?, ?, ?,
				?, ?, ?,
				?, ?
			)
		`).bind(
      id,
      mnemonic.url,
      mnemonic.metadata?.width || 0,
      mnemonic.metadata?.height || 0,
      mnemonic.metadata?.size || 0,
      mnemonic.metadata?.mimeType || "",
      mnemonic.metadata?.exif?.make || null,
      mnemonic.metadata?.exif?.model || null,
      mnemonic.metadata?.exif?.dateTimeOriginal || null,
      mnemonic.metadata?.exif?.exposureTime || null,
      mnemonic.metadata?.exif?.fNumber || null,
      mnemonic.metadata?.exif?.isoSpeedRatings || null,
      mnemonic.metadata?.exif?.focalLength || null,
      mnemonic.metadata?.exif?.lensModel || null,
      mnemonic.metadata?.location?.latitude || null,
      mnemonic.metadata?.location?.longitude || null,
      mnemonic.metadata?.location?.altitude || null,
      now,
      now
    ).run();

    return {
      success: true,
      result: {
        mnemonic: {
          id,
          ...mnemonic
        },
      },
    };
  }
}
