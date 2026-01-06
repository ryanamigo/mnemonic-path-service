import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { AppContext, Mnemonic } from "../../types";

export class MnemonicFetch extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonics"],
    summary: "Fetch a Mnemonic",
    request: {
      params: z.object({
        id: Str(),
      }),
    },
    responses: {
      "200": {
        description: "Returns the mnemonic",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                mnemonic: Mnemonic,
              }),
            }),
          },
        },
      },
      "404": {
        description: "Mnemonic not found",
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { id } = data.params;

    const row: any = await c.env.mnemonic_db.prepare("SELECT * FROM images WHERE id = ?").bind(id).first();

    if (!row) {
      return {
        success: false,
        error: "Mnemonic not found",
      };
    }

    return {
      success: true,
      result: {
        mnemonic: {
          url: row.url,
          metadata: {
            width: row.width,
            height: row.height,
            size: row.size,
            mimeType: row.mime_type,
            exif: {
              make: row.make,
              model: row.model,
              dateTimeOriginal: row.date_time_original,
              exposureTime: row.exposure_time,
              fNumber: row.f_number,
              isoSpeedRatings: row.iso_speed_ratings,
              focalLength: row.focal_length,
              lensModel: row.lens_model,
            },
            location: {
              latitude: row.latitude,
              longitude: row.longitude,
              altitude: row.altitude,
            },
          },
        },
      },
    };
  }
}
