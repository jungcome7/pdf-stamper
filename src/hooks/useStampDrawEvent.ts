import { useEffect } from "react";
import { STAMP_DRAW_EVENT } from "@/constants";

interface UseStampDrawEventProps {
  isStampReady: boolean;
  addStampToCanvas: () => void;
}

/**
 * 도장 그리기 이벤트를 관리하는 커스텀 훅
 */
const useStampDrawEvent = ({
  isStampReady,
  addStampToCanvas,
}: UseStampDrawEventProps) => {
  /**
   * 도장 그리기 이벤트 리스너 등록 및 정리
   */
  useEffect(() => {
    const handleStampDrawEvent = () => {
      if (isStampReady) {
        addStampToCanvas();
      }
    };

    document.addEventListener(STAMP_DRAW_EVENT, handleStampDrawEvent);

    return () => {
      document.removeEventListener(STAMP_DRAW_EVENT, handleStampDrawEvent);
    };
  }, [isStampReady, addStampToCanvas]);
};

export default useStampDrawEvent;
