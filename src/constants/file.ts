export const FILE_TYPES = {
  PDF: "application/pdf",
  PNG: "image/png",
};

export const FILE_EXTENSIONS = {
  PDF: ".pdf",
  PNG: ".png",
};

export const getDownloadFileName = (originalFileName: string): string => {
  const now = new Date();
  const dateTime = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .split(".")[0];

  const lastDotIndex = originalFileName.lastIndexOf(".");
  const name =
    lastDotIndex !== -1
      ? originalFileName.substring(0, lastDotIndex)
      : originalFileName;
  const extension =
    lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : "";

  return `${name}_${dateTime}${extension}`;
};
