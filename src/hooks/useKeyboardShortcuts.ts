import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  deleteSelectedObject: () => void;
}

/**
 * 키보드 단축키를 관리하는 커스텀 훅
 * @param deleteSelectedObject 선택된 객체를 삭제하는 함수
 */
const useKeyboardShortcuts = ({
  deleteSelectedObject,
}: UseKeyboardShortcutsProps) => {
  /**
   * 키보드 이벤트 리스너 등록 및 정리
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        deleteSelectedObject();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedObject]);
};

export default useKeyboardShortcuts;
