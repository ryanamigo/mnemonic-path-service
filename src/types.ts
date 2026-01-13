import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Task = z.object({
  name: Str({ example: "lorem" }),
  slug: Str(),
  description: Str({ required: false }),
  completed: z.boolean().default(false),
  due_date: DateTime(),
});

export const GPSCoordinates = z.object({
  latitude: z.number().describe("纬度"),
  longitude: z.number().describe("经度"),
  altitude: z.number().optional().describe("海拔"),
});

export const ExifData = z.object({
  make: Str({ required: false }).describe("设备制造商"),
  model: Str({ required: false }).describe("设备型号"),
  dateTimeOriginal: DateTime({ required: false }).describe("原始拍摄时间"),
  exposureTime: Str({ required: false }).describe("曝光时间"),
  fNumber: z.number().optional().describe("光圈值"),
  isoSpeedRatings: z.number().optional().describe("ISO 感光度"),
  focalLength: z.number().optional().describe("焦距"),
  lensModel: Str({ required: false }).describe("镜头型号"),
});

export const ImageMetadata = z.object({
  width: z.number().describe("图片宽度"),
  height: z.number().describe("图片高度"),
  size: z.number().describe("文件大小 (字节)"),
  mimeType: Str().describe("MIME 类型"),
  exif: ExifData.optional().describe("EXIF 信息"),
  location: GPSCoordinates.optional().describe("地理位置信息"),
});

export const MnemonicCreateParams = z.object({
  url: z.string().url(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    size: z.number().optional(),
    mimeType: z.string().optional(),
    exif: z.object({
      make: z.string().nullable().optional(),
      model: z.string().nullable().optional(),
      dateTimeOriginal: z.string().nullable().optional(),
      exposureTime: z.string().nullable().optional(),
      fNumber: z.number().nullable().optional(),
      isoSpeedRatings: z.number().nullable().optional(),
      focalLength: z.number().nullable().optional(),
      lensModel: z.string().nullable().optional(),
    }).optional(),
    location: z.object({
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      altitude: z.number().nullable().optional(),
    }).optional(),
  }).optional(),
})

export const Mnemonic = z.object({
  id: z.string(),
  url: z.string().url(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    size: z.number().optional(),
    mimeType: z.string().optional(),
    exif: z.object({
      make: z.string().nullable().optional(),
      model: z.string().nullable().optional(),
      dateTimeOriginal: z.string().nullable().optional(),
      exposureTime: z.string().nullable().optional(),
      fNumber: z.number().nullable().optional(),
      isoSpeedRatings: z.number().nullable().optional(),
      focalLength: z.number().nullable().optional(),
      lensModel: z.string().nullable().optional(),
    }).optional(),
    location: z.object({
      latitude: z.number().nullable().optional(),
      longitude: z.number().nullable().optional(),
      altitude: z.number().nullable().optional(),
    }).optional(),
  }).optional(),
})
