import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export const pdfFileToImage = async (
  file: File
): Promise<{
  image: string;
  error: string | null;
  fileName: string;
}> => {
  let pdfUrl = "";

  try {
    pdfUrl = URL.createObjectURL(file);
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    const renderPageToImage = async (): Promise<string> => {
      try {
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("캔버스 컨텍스트를 생성할 수 없습니다");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        return canvas.toDataURL("image/png");
      } catch (error) {
        throw new Error(
          `PDF 페이지 렌더링 실패: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    return {
      image: await renderPageToImage(),
      error: null,
      fileName: file.name,
    };
  } catch (error) {
    return {
      image: "",
      error: `PDF 변환 실패: ${
        error instanceof Error ? error.message : String(error)
      }`,
      fileName: file.name,
    };
  } finally {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
  }
};

export const getImageByFile = async (file: File): Promise<string | null> => {
  try {
    const result = await pdfFileToImage(file);
    return result.error ? null : result.image;
  } catch {
    return null;
  }
};
