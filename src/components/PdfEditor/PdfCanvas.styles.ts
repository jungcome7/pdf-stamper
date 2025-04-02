import styled from "@emotion/styled";

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const CanvasWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  max-width: ${500}px;
`;

export const ErrorMessage = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background-color: #fff3f3;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #d32f2f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  z-index: 10;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
`;

export const LoadingMessage = styled.div`
  background-color: #f5f5f5;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: bold;
`;

export const DownloadButton = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #5e5e5e;
  color: white;
  border: none;
  cursor: pointer;
`;

export const ErrorIcon = styled.span`
  margin-right: 8px;
`;
