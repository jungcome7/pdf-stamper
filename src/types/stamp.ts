export interface Stamp {
  id: string;
  url: string;
}

// 캔버스에 찍힌 도장 인스턴스 정보
export interface StampInstance {
  id: string; // 고유 ID
  stampId: string; // 사용된 도장의 ID
  pageNumber: number; // 도장이 찍힌 페이지 번호
  left: number; // X 좌표
  top: number; // Y 좌표
  scaleX: number; // 가로 비율
  scaleY: number; // 세로 비율
  url: string; // 도장 이미지 URL
}
