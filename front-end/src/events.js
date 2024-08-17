import { getBooks } from './apis.js';
import {
  $cardCon,
  $favoriteBtn,
  $favoriteCardCon,
  $favoriteModal,
  $headerLogo,
  $paginationCon,
  $searchedWord,
  $searchForm,
  $searchInput,
} from './elements.js';
import { init } from './init.js';
import bookStorage from './local_storage.js';
import { alignPage, initializePaginationBtns } from './paginations.js';
import {
  closeFavoriteModal,
  openFavoriteModal,
  removeLoader,
  renderBooks,
  renderLoader,
} from './render.js';
import {
  currentEndpoint,
  currentInput,
  currentPage,
  setCurrentEndpoint,
  setCurrentInput,
  totalPages,
} from './states.js';

//* Event Handlers
const onClickCardCon = (e) => {
  const { target } = e;
  if (!(target.closest('.cards') || target.closest('.favorite-cards'))) return;
  if (target.matches('.heart-btn')) {
    //* onClickHeartBtn
    if (target.classList.contains('fa-regular')) {
      //* 찜 안한 상품
      bookStorage.addBook({
        isbn13: target.closest('li.card').dataset.isbn13, //* 찜 목록에 추가. 20개 넘어가면 false 반환 및 찜 안됨
      }) && target.classList.replace('fa-regular', 'fa-solid');
    } else if (target.classList.contains('fa-solid')) {
      //* 이미 찜한 상품
      target.classList.replace('fa-solid', 'fa-regular');
      bookStorage.deleteBook({
        isbn13: target.closest('li.card').dataset.isbn13,
      }); //* 찜 목록에서 삭제
    }
  }
};
const onClickPagination = async (e) => {
  const { target } = e;
  if (target.matches('.page-btn')) {
    const page = +target.dataset.page;
    if (currentPage === page) return;
    const fetchedBooks = await getBooks({
      endpoint: currentEndpoint,
      page,
      query: currentInput,
    });
    renderBooks({ books: fetchedBooks });
    $paginationCon.querySelector('.page-btn.on').classList.remove('on');
    target.classList.add('on');
    alignPage({ targetPage: page });
  }
  if (target.matches('.prev')) {
    if (currentPage <= 1) return;
    const $prevPageBtn = $paginationCon.querySelector('.on');
    const fetchedBooks = await getBooks({
      endpoint: currentEndpoint,
      page: currentPage - 1,
      query: currentInput,
    });
    $prevPageBtn.classList.remove('on');
    $prevPageBtn.previousElementSibling.classList.add('on');
    renderBooks({ books: fetchedBooks });
    alignPage({ targetPage: currentPage - 1 });
  }
  if (target.matches('.next')) {
    if (currentPage >= totalPages) return;
    const $prevPageBtn = $paginationCon.querySelector('.on');
    const fetchedBooks = await getBooks({
      endpoint: currentEndpoint,
      page: currentPage + 1,
      query: currentInput,
    });
    $prevPageBtn.classList.remove('on');
    $prevPageBtn.nextElementSibling.classList.add('on');
    renderBooks({ books: fetchedBooks });
    alignPage({ targetPage: currentPage + 1 });
  }
};

const onSubmit = async (e) => {
  e.preventDefault();
  if ($searchInput.value.trim() === currentInput) return; //현재 검색어와 같은 검색어 입력시 무시
  if (!$searchInput.value.trim()) {
    //* 빈 문자열일 때 첫 화면으로 돌아감
    init();
    return;
  }
  const searchedBooks = await getBooks({
    query: $searchInput.value,
    endpoint: 'search',
    page: 1,
  });
  initializePaginationBtns({ totalPages });
  setCurrentEndpoint('search'); //! 여기서만 재할당됨
  renderBooks({ books: searchedBooks });
  $searchedWord.parentElement.style.display = 'block';
  $searchedWord.textContent = $searchInput.value.trim();
  setCurrentInput($searchInput.value.trim());
  $searchInput.value = '';
};
const onClickFavoriteBtn = async () => {
  renderLoader();
  Promise.all(
    bookStorage
      .getBooks()
      .map((isbn13) =>
        getBooks({ endpoint: 'lookup', itemId: isbn13, triggerLoader: false })
      )
  )
    .then((arr) => {
      renderBooks({
        books: arr.map((res) => res[0]),
        $parent: $favoriteCardCon,
      });
      removeLoader(); //* loader 종료 후 modal 열어야 modal wrapper 안 사라짐.
      openFavoriteModal();
    })
    .catch((error) => {
      removeLoader();
      console.error(error);
    });
};

//* Event Listeners
$cardCon.addEventListener('mouseup', onClickCardCon);
$favoriteCardCon.addEventListener('mouseup', onClickCardCon);
$paginationCon.addEventListener('mouseup', onClickPagination);
$searchForm.addEventListener('submit', onSubmit);
$favoriteBtn.addEventListener('mouseup', onClickFavoriteBtn);
$headerLogo.addEventListener('mouseup', init); //* 헤더 로고 클릭 시 첫 화면으로 돌아감
$favoriteModal.addEventListener('mouseup', async (e) => {
  const { target } = e;
  if (target.matches('.favorite-modal .close-btn')) {
    closeFavoriteModal();
    const newBooks = await getBooks({
      page: currentPage,
      endpoint: currentEndpoint,
      query: currentInput,
    }); //* 찜 해제 도서 동기화를 위해 찜 목록에서 나오면 다시 렌더링해야함
    renderBooks({ books: newBooks });
  }
});
