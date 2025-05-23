## 과제 구현 설명

- React와 TypeScript를 기반으로 PDF 전자도장 프로젝트를 구현했습니다. PDF 문서에 도장 이미지를 추가하고, 위치를 조정한 후 최종 문서를 다운로드할 수 있는 기능을 제공합니다.
- 프로젝트 폴더 구조는 아래와 같습니다.
  ```src/
  ├── components/ - UI 컴포넌트
  ├── hooks/ - 커스텀 훅
  ├── utils/ - 유틸리티 함수
  ├── types/ - 타입 정의
  ├── constants/ - 상수 정의
  ├── store/ - 전역 상태 관리
  └── styles/ - 전역 스타일
  ```
- 커스텀 훅을 적극 활용해 UI와 비즈니스 로직을 분리했습니다. `useRenderPdfToCanvas`는 PDF 파일을 캔버스에 렌더링하고, `usePdfPages`는 페이지 이미지를 관리합니다. `useStampManager`는 도장 이미지 관리 기능을, `useStampDrawing`은 캔버스에 도장 추가 기능을 제공합니다. 또한 `useKeyboardShortcuts`로 단축키를 지원합니다.
- PDF 처리 과정의 예외 상황은 try-catch로 관리합니다. 오류 발생 시 필요한 경우 사용자에게 피드백을 제공합니다. PDF와 PNG 파일 형식을 검증하고 도장 개수를 최대 5개로 제한합니다. PDF 로딩 중에는 로딩 상태를 표시해 사용자에게 진행 상황을 알립니다.
- Emotion을 사용해 컴포넌트별로 스타일을 모듈화했습니다. 각 컴포넌트는 자체 .styles.ts 파일을 가지며, props를 통한 조건부 스타일링을 구현했습니다. 전역 스타일은 global.ts에서 관리합니다.
- 실행 커멘드
  - `npm run start:dev`
  - `npm run start:prod`

## [팀리부뜨] 프론트엔드 사전 과제

## 사전 과제 안내

[전자 도장을 찍어보자!] 프로젝트는 현재 작업이 중단된 상태입니다. 😭

아래 내용과 요구사항을 확인하시고, 프로젝트를 완성해 주세요. 😄

프로젝트에는 일부 기능이 이미 구현되어 있으며, 요구사항에 맞게 자유롭게 수정 및 확장이 가능합니다.
또한, CSS-in-JS 모듈을 제외한 기능 구현에 필요한 모든 핵심 모듈은
의존성 주입이 완료되어 있어 별도의 추가 설치 없이 바로 활용할 수 있습니다.
PDF 파일과 전자 도장 이미지는 files 폴더에서 확인해 주세요.

### 요구사항

- npm 스크립트를 활용하여 개발 모드와 프로덕션 모드를 각각 실행할 수 있도록 구성되어야 합니다.
- 전체 코드와 파일은 각 역할에 맞게 체계적으로 재구성되어, 유지보수와 확장이 용이하도록 폴더별로 정리되어야 합니다.
- 모든 모듈과 컴포넌트는 명확하게 타입이 정의되어, 안정성과 개발 생산성이 보장되어야 합니다.
- CSS-in-JS 모듈(예: styled-components, Emotion 등)을 이용해 일관되고 효율적인 방식으로 스타일을 관리해야 합니다.
- 전자 도장 이미지는 최대 5개까지 업로드할 수 있습니다.
- PDF 파일 업로드, 다운로드, 삭제 기능을 제공되어야 합니다.
- 업로드 가능한 파일 형식은 PDF 및 PNG 파일로 제한합니다.
- 업로드된 PDF 파일은 모든 페이지를 미리보기 형태로 제공되어야 합니다.
- 업로드된 PDF 파일의 모든 페이지에 전자 도장을 찍을 수 있어야 합니다.

### 평가 요소

- 모든 기능은 사용자가 기대하는 대로 완벽하게 동작하는가
- 예외 상황에 대한 처리가 안정적으로 이루어졌는가
- 가독성, 일관된 코딩 스타일, 모듈화 및 주석 작성 등 유지보수성이 우수한가
- 명확한 타입 정의와 인터페이스를 적용 이를 통해 코드의 안정성, 유지보수성 및 개발 생산성이 보장되는가
- PDF 파일 업로드/다운로드 비동기 처리와 리소스 관리 등 성능 최적화가 이루어졌는가
