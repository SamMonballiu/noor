import imageThumbnail from "image-thumbnail";

export const generateThumbnail = async (
  path: string,
  size:
    | {
        width: number;
        height: number;
      }
    | {
        percentage: number;
      },
  quality: number = 60,
) => {
  //@ts-ignore
  let stream: ReadStream | null = null;

  //@ts-ignore
  const thumbnail = await imageThumbnail(stream ?? path, {
    fit: "cover",
    responseType: "buffer",
    jpegOptions: {
      force: true,
      quality,
    },
    withMetaData: true,
    ...size,
  });

  return thumbnail;
};
