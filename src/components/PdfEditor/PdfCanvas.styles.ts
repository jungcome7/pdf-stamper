import styled from "@emotion/styled";

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const CanvasWrapper = styled.div``;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
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
