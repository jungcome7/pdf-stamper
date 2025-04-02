import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    padding: 12px;
  }
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PdfUploadArea = styled.div`
  min-height: 48px;
`;

export const PdfFileArea = styled.div`
  min-height: 48px;
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const Button = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #5e5e5e;
  color: white;
  border: none;
  cursor: pointer;
`;

export const RemoveButton = styled.button`
  padding: 4px 8px;
  background-color: transparent;
  color: #5e5e5e;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;
