import { getBooks } from './apis.ts';
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
} from './elements.ts';
import { init } from './init.ts';
import bookStorage from './local_storage.ts';
import { alignPage, initializePaginationBtns } from './paginations.ts';
import {
  closeFavoriteModal,
  openFavoriteModal,
  removeLoader,
  renderBooks,
  renderLoader,
} from './render.ts';
import {
  currentEndpoint,
  currentInput,
  currentPage,
  setCurrentEndpoint,
  setCurrentInput,
  totalPages,
} from './states.ts';

//* Event Handlers
const onClickCardCon = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const $card = target.closest('.cards') || target.closest('.favorite-cards');

  if (!$card) return;

  if (target.matches('.heart-btn')) {
    const card = target.closest('li.card') as HTMLElement;
    const isbn13 = card?.dataset.isbn13;
    if (!isbn13) return;
    if (target.classList.contains('fa-regular')) {
      //* 찜 안한 상품
      if (bookStorage.addBook({ isbn13 })) {
        target.classList.replace('fa-regular', 'fa-solid');
      }
    } else if (target.classList.contains('fa-solid')) {
      //* 이미 찜한 상품
      target.classList.replace('fa-solid', 'fa-regular');
      bookStorage.deleteBook({ isbn13 });
    }
  }
};

const onClickPagination = async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.matches('.page-btn')) {
    const page = +target.dataset.page!;
    if (currentPage === page) return;
    const fetchedBooks = await getBooks({
      endpoint: currentEndpoint,
      page,
      query: currentInput,
    });
    renderBooks({ books: fetchedBooks });
    $paginationCon.querySelector('.page-btn.on')?.classList.remove('on');
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
    $prevPageBtn?.classList.remove('on');
    $prevPageBtn?.previousElementSibling?.classList.add('on');
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
    $prevPageBtn?.classList.remove('on');
    $prevPageBtn?.nextElementSibling?.classList.add('on');
    renderBooks({ books: fetchedBooks });
    alignPage({ targetPage: currentPage + 1 });
  }
};

const onSubmit = async (e: SubmitEvent) => {
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
  $searchedWord.parentElement!.style.display = 'block';
  $searchedWord.textContent = $searchInput.value.trim();
  setCurrentInput($searchInput.value.trim());
  $searchInput.value = '';
};
const onClickFavoriteBtn = async () => {
  renderLoader();
  Promise.all(
    bookStorage.getBooks().map((isbn13: string) =>
      getBooks({
        endpoint: 'lookup',
        itemId: isbn13,
        triggerLoader: false,
        triggerScroll: false,
      })
    )
  )
    .then((arr) => {
      console.log(arr);
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

const onClickFavoriteModal = async (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  //* onClickCloseBtn
  if (target.matches('.favorite-modal .close-btn')) {
    closeFavoriteModal();
    const newBooks = await getBooks({
      page: currentPage,
      endpoint: currentEndpoint,
      query: currentInput,
      triggerScroll: false,
    }); //* 찜 해제 도서 동기화를 위해 찜 목록에서 나오면 다시 렌더링해야함
    renderBooks({ books: newBooks });
  }
};
//* Event Listeners
$cardCon.addEventListener('mouseup', onClickCardCon);
$favoriteCardCon.addEventListener('mouseup', onClickCardCon);
$paginationCon.addEventListener('mouseup', onClickPagination);
$searchForm.addEventListener('submit', onSubmit);
$favoriteBtn.addEventListener('mouseup', onClickFavoriteBtn);
$headerLogo.addEventListener('mouseup', init); //* 헤더 로고 클릭 시 첫 화면으로 돌아감
$favoriteModal.addEventListener('mouseup', onClickFavoriteModal);
