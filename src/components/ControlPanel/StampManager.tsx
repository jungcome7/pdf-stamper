import useStampManager from "@/hooks/useStampManager";
import {
  StampManagerContainer,
  StampUploadArea,
  StampButton,
  StampsContainer,
  StampItem,
  DeleteButton,
} from "./StampManager.styles";
import { FILE_EXTENSIONS, MAX_STAMPS } from "@/constants";

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
          accept={FILE_EXTENSIONS.PNG}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
        />
        <StampButton
          type="button"
          onClick={handleUploadClick}
          disabled={isMaxStampsReached}
          isMaxStampsReached={isMaxStampsReached}
        >
          도장 업로드 ({stamps.length}/{MAX_STAMPS})
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
