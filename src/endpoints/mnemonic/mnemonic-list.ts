import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext, Mnemonic } from "../../types";

export class MnemonicList extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonics"],
    summary: "List Mnemonics",
    responses: {
      "200": {
        description: "Returns a list of mnemonics",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                mnemonics: z.array(Mnemonic),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const result = await c.env.mnemonic_db.prepare("SELECT * FROM images").all();
    const mnemonics = result.results.map((row: any) => ({
      id: row.id,
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
    }));

    return {
      success: true,
      result: {
        mnemonics: mnemonics,
      },
    };
  }
}
