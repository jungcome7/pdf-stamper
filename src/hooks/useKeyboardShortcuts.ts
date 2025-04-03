import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  deleteSelectedObject: () => void;
}

/**
 * 키보드 단축키를 관리하는 커스텀 훅
 */
const useKeyboardShortcuts = ({
  deleteSelectedObject,
}: UseKeyboardShortcutsProps) => {
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
