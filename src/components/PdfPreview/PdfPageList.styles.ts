import styled from "@emotion/styled";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    padding: 12px;
  }
`;

export const Button = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #5e5e5e;
  color: white;
  border: none;
  cursor: pointer;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  gap: 12px;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const ImageContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  overflow: hidden;
  width: 160px;
  border-radius: 12px;
  background-color: aliceblue;
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
`;

export const ImageIndex = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px 0;
  font-size: 12px;
`;
