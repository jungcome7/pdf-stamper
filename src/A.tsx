import { useRef } from "react";
import { useStore } from "@/store";

import "./A.css";
import Stamp1 from "./files/stamp-1.jpg";

const A = () => {
  const { file, setFile } = useStore();

  const stampInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFile(file!);

    e.target.value = "";
  };

  const handleStampUpload = () => {
    stampInputRef.current?.click();
  };

  const handlePDFUpload = () => {
    pdfInputRef.current?.click();
  };

  const handlePDFRemove = () => {
    setFile(null);
  };

  const handleStampDraw = async () => {};

  return (
    <div className="A">
      <div className="top">
        <div>
          <div className="pdfUpload">
            <input
              ref={pdfInputRef}
              type="file"
              onChange={handlePDFChange}
              style={{ display: "none" }}
            />

            <button type="button" onClick={handlePDFUpload}>
              PDF 업로드
            </button>
          </div>

          <div className="pdfFile">
            {!!file?.name && (
              <>
                📄 파일명: <strong>{file?.name}</strong>
                <button
                  type="button"
                  className="pdfFileRemove"
                  onClick={handlePDFRemove}
                >
                  X
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="stampUpload">
            <input
              ref={stampInputRef}
              type="file"
              accept=".png"
              onChange={() => {}}
              style={{ display: "none" }}
            />
            <button type="button" onClick={handleStampUpload}>
              도장 업로드
            </button>
          </div>

          <div className="stamps">
            <img src={Stamp1} />
          </div>
        </div>
      </div>

      <div className="bottom">
        <button type="button" onClick={handleStampDraw}>
          도장 찍기
        </button>
      </div>
    </div>
  );
};

export default A;
