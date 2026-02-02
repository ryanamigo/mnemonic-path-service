import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { AppContext, Mnemonic } from "../../types";
import { success } from "../../utils/response";

export class MnemonicList extends OpenAPIRoute {
  schema = {
    tags: ["Mnemonic"],
    summary: "List Mnemonics",
    request: {
      query: z.object({
        page: Num({ default: 1, description: "Page number" }), // Start with simple Num, validions via zod if needed or assume Num handles basic default/desc
        pageSize: Num({ default: 20, description: "Items per page" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of mnemonics",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              result: z.object({
                mnemonics: z.array(Mnemonic),
                pagination: z.object({
                  total: z.number(),
                  page: z.number(),
                  pageSize: z.number(),
                  totalPages: z.number(),
                  isLastPage: z.boolean(),
                }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { page, pageSize } = data.query;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const [results, totalResult] = await Promise.all([
      c.env.mnemonic_db.prepare("SELECT * FROM images LIMIT ? OFFSET ?").bind(limit, offset).all(),
      c.env.mnemonic_db.prepare("SELECT COUNT(*) as total FROM images").first(),
    ]);

    const total = (totalResult as any)?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    const isLastPage = page >= totalPages;

    const mnemonics = results.results.map((row: any) => ({
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

    return success(mnemonics, {
      total,
      page,
      pageSize,
      totalPages,
      isLastPage,
    });
  }
}
