//* Utility Functions
const generateSequentialNumbers = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const generatePaginationNumbers = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  if (totalPages <= 10) return generateSequentialNumbers(1, totalPages); //* 총 페이지 수가 10 이하인 경우 모든 페이지 번호 표시
  let start = Math.max(currentPage - 4, 1);
  let end = Math.min(start + 9, totalPages);
  start = Math.max(end - 9, 1); //* end가 totalPages에 도달했을 때, start를 조정
  return generateSequentialNumbers(start, end);
};

export { generatePaginationNumbers, generateSequentialNumbers };
