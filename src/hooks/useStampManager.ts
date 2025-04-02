import { useRef } from "react";
import { useStore } from "@/store";
import { Stamp } from "@/types";

export const useStampManager = () => {
  const { stamps, addStamp, removeStamp, selectedStampId, setSelectedStampId } =
    useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 최대 5개 제한 검사
    const availableSlots = 5 - stamps.length;
    if (availableSlots <= 0) {
      alert("도장은 최대 5개까지 업로드 가능합니다.");
      e.target.value = "";
      return;
    }

    // 여러 파일 처리
    const filesToProcess = Math.min(availableSlots, files.length);
    const filePromises: Promise<string>[] = [];

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];

      // PNG 파일만 허용
      if (!file.type.includes("png")) {
        alert(
          `${file.name}은(는) PNG 파일이 아닙니다. PNG 파일만 업로드 가능합니다.`
        );
        continue;
      }

      // 파일을 데이터 URL로 변환하는 Promise 생성
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });

      filePromises.push(promise);
    }

    // 모든 파일 처리가 완료되면 도장 추가
    Promise.all(filePromises).then((urls) => {
      urls.forEach((url) => {
        const newStamp: Stamp = {
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 9),
          url,
        };
        addStamp(newStamp);
      });
    });

    e.target.value = "";
  };

  const handleRemoveStamp = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (selectedStampId === id) {
      setSelectedStampId(null);
    }

    removeStamp(id);
  };

  const handleSelectStamp = (id: string) => {
    setSelectedStampId(id === selectedStampId ? null : id);
  };

  return {
    stamps,
    selectedStampId,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handleRemoveStamp,
    handleSelectStamp,
    isMaxStampsReached: stamps.length >= 5,
  };
};

export default useStampManager;
