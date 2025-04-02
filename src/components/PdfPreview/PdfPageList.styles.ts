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

interface ImageContainerProps {
  isSelected: boolean;
}

export const ImageContainer = styled.div<ImageContainerProps>`
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  overflow: hidden;
  width: 160px;
  border-radius: 12px;
  background-color: aliceblue;
  border: ${(props) => (props.isSelected ? "2px solid #4285f4" : "none")};
  box-shadow: ${(props) =>
    props.isSelected ? "0 0 8px rgba(66, 133, 244, 0.6)" : "none"};

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
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

export const LoadingMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #555;
  width: 100%;
`;

export const ErrorMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #d32f2f;
  background-color: #fff3f3;
  border-radius: 8px;
  margin: 16px 0;
  width: 80%;
`;

export const EmptyMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #777;
  width: 100%;
`;
