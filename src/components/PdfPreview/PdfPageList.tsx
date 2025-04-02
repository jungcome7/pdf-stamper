import { usePdfPages } from "@/hooks";
import {
  Container,
  TopSection,
  ImageContainer,
  Image,
  ImageIndex,
} from "./PdfPageList.styles";
import { useStore } from "@/store";

const PdfPageList = () => {
  const { currentPage, setCurrentPage } = useStore();
  const pages = usePdfPages();

  const handlePageClick = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Container>
      <TopSection>
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            onClick={() => handlePageClick(page.pageNumber)}
          >
            <ImageContainer isSelected={currentPage === page.pageNumber}>
              <Image src={page.imageUrl} alt={`Page ${page.pageNumber}`} />
            </ImageContainer>
            <ImageIndex>{page.pageNumber}</ImageIndex>
          </div>
        ))}
      </TopSection>
    </Container>
  );
};

export default PdfPageList;
