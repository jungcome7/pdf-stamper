import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 1512px;
  max-width: 1512px;
  height: 100%;
  min-height: 752px;
  max-height: 752px;
`;

export const panelStyles = css`
  overflow: hidden;
  height: 100%;
  background: #e9e9e9;
  border-radius: 8px;
`;

export const ControlPanelWrapper = styled.div`
  ${panelStyles}
  flex: 0 0 280px;
`;

export const PdfCanvasWrapper = styled.div`
  ${panelStyles}
  flex: 0 0 962px;
`;

export const PdfPageListWrapper = styled.div`
  ${panelStyles}
  flex: 0 0 250px;
`;
