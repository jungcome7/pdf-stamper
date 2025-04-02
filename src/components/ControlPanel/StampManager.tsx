import useStampManager from "@/hooks/useStampManager";
import {
  StampManagerContainer,
  StampUploadArea,
  StampButton,
  StampsContainer,
  StampItem,
  DeleteButton,
} from "./StampManager.styles";

const StampManager = () => {
  const {
    stamps,
    selectedStampId,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handleRemoveStamp,
    handleSelectStamp,
    isMaxStampsReached,
  } = useStampManager();

  return (
    <StampManagerContainer>
      <StampUploadArea>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png"
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        />
        <StampButton
          type="button"
          onClick={handleUploadClick}
          disabled={isMaxStampsReached}
          style={{
            opacity: isMaxStampsReached ? "0.6" : "1",
            cursor: isMaxStampsReached ? "not-allowed" : "pointer",
          }}
        >
          도장 업로드 ({stamps.length}/5)
        </StampButton>
      </StampUploadArea>

      <StampsContainer>
        {stamps.map((stamp) => (
          <StampItem
            key={stamp.id}
            isSelected={selectedStampId === stamp.id}
            onClick={() => handleSelectStamp(stamp.id)}
          >
            <img src={stamp.url} alt="도장" />
            <DeleteButton
              type="button"
              onClick={(e) => handleRemoveStamp(stamp.id, e)}
            >
              ×
            </DeleteButton>
          </StampItem>
        ))}
      </StampsContainer>
    </StampManagerContainer>
  );
};

export default StampManager;
