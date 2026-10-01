import { cloudinary } from "./server";

export type CloudinaryResourceType = "image" | "video";

export interface CloudinaryUploadResult {
  publicId: string;
  assetId: string;
  resourceType: CloudinaryResourceType;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  originalFilename?: string;
}

interface UploadOptions {
  folder: string;
  publicId?: string;
  resourceType: CloudinaryResourceType;
  originalFilename?: string;
}

function getResourceType(
  resourceType: CloudinaryResourceType,
): "image" | "video" {
  return resourceType;
}

export async function uploadMedia(
  file: File,
  options: UploadOptions,
): Promise<CloudinaryUploadResult> {
  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!buffer.length) {
    throw new Error("File is empty.");
  }

  const resourceType = getResourceType(options.resourceType);

  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: resourceType,
        overwrite: false,
        unique_filename: true,
        use_filename: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result."));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });

  return {
    publicId: result.public_id,
    assetId: result.asset_id,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    originalFilename: options.originalFilename,
  };
}

export async function deleteMedia(
  publicId: string,
  resourceType: CloudinaryResourceType,
): Promise<void> {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}





