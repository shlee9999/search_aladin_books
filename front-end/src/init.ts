import {
  $cardCon,
  $paginationCon,
  $searchInput,
  $searchedWord,
} from './elements.ts';
import { renderBooks } from './render.ts';
import {
  totalPages,
  setCurrentEndpoint,
  setCurrentInput,
  setCurrentPage,
  setTotalPages,
} from './states.ts';
import { getBooks } from './apis.ts';
import { initializePaginationBtns } from './paginations.ts';
//*inits
const init = async () => {
  $paginationCon.style.display = 'none';
  setCurrentEndpoint('list');
  setCurrentInput('');
  setCurrentPage(1);
  setTotalPages(1);
  const newBooks = await getBooks({ page: 1, endpoint: 'list', query: '' }); //* 신간 도서 렌더링
  $searchedWord.parentElement!.style.display = 'none';
  initializePaginationBtns({ totalPages });
  renderBooks({ books: newBooks });
  $paginationCon.style.display = 'flex';
  $searchInput.focus();
};
await init(); //* Top-level await, 모듈 스크립트에서만 사용 가능
$cardCon.style.color = 'unset'; //* 페이지 첫 로딩 후 "검색 결과가 없어요!" 문구 표시. css에서 기본적으로 투명하게 해놓음

export { init };
