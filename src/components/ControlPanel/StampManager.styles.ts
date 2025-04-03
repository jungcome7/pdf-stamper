import styled from "@emotion/styled";
import { Button } from "./ControlPanel.styles";

export const StampManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StampUploadArea = styled.div`
  min-height: 48px;
`;

export const StampButton = styled(Button)<{ isMaxStampsReached: boolean }>`
  opacity: ${({ isMaxStampsReached }) => (isMaxStampsReached ? "0.6" : "1")};
  cursor: ${({ isMaxStampsReached }) =>
    isMaxStampsReached ? "not-allowed" : "pointer"};
`;

export const StampsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 54px;

  img {
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 4px;
  }
`;

export const StampItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${(props) => (props.isSelected ? "2px solid #4285f4" : "none")};
  border-radius: 4px;
`;

export const StampImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    background-color: #ff7875;
  }
`;
