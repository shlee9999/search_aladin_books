import { $paginationCon, $searchInput, $searchedWord } from './elements.js';
import { renderBooks } from './render.js';
import {
  totalPages,
  setCurrentEndpoint,
  setCurrentInput,
  setCurrentPage,
  setTotalPages,
} from './states.js';
import { getBooks } from './apis.js';
import { initializePaginationBtns } from './paginations.js';
//*inits
const init = async () => {
  $paginationCon.style.display = 'none';
  setCurrentEndpoint('list');
  setCurrentInput('');
  setCurrentPage(1);
  setTotalPages(1);
  const newBooks = await getBooks({ page: 1, endpoint: 'list', query: '' }); //* 신간 도서 렌더링
  $searchedWord.parentElement.style.display = 'none';
  initializePaginationBtns({ totalPages });
  renderBooks({ books: newBooks });
  $paginationCon.style.display = 'flex';
  $searchInput.focus();
};
init();

export { init };
