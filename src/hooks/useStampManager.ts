import { useRef } from "react";
import { useStore } from "@/store";
import { Stamp } from "@/types";
import { MAX_STAMPS, FILE_TYPES } from "@/constants";

/**
 * 도장 관리를 위한 커스텀 훅
 * @returns 도장 관리에 필요한 상태와 메서드들을 포함하는 객체
 */
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

    const availableSlots = MAX_STAMPS - stamps.length;
    if (availableSlots <= 0) {
      alert(`도장은 최대 ${MAX_STAMPS}개까지 업로드 가능합니다.`);
      e.target.value = "";
      return;
    }

    const filesToProcess = Math.min(availableSlots, files.length);
    const filePromises: Promise<string>[] = [];

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];

      if (!file.type.includes(FILE_TYPES.PNG.split("/")[1])) {
        alert(
          `${file.name}은(는) PNG 파일이 아닙니다. PNG 파일만 업로드 가능합니다.`
        );
        continue;
      }

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
    isMaxStampsReached: stamps.length >= MAX_STAMPS,
  };
};

export default useStampManager;
