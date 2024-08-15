import bookStorage from './local_storage.js';

//* DOM Elements
const $cardCon = document.querySelector('.cards');
const $paginationCon = document.querySelector('.pagination-con');
const $pageBtnCon = $paginationCon.querySelector('.page-btn-con');
const $searchForm = document.querySelector('.search-form');
const $searchInput = $searchForm[0];
const $searchedWord = document.querySelector('.searched-word');
const $modalWrap = document.querySelector('.modal-wrap');
const $favoriteModal = document.querySelector('.favorite-modal');
const $favoriteCardCon = $favoriteModal.querySelector('.favorite-cards');
const $loader = document.querySelector('.loader');
const $favoriteBtn = document.querySelector('.favorite-btn');

//* States
let currentEndpoint = 'list';
let currentPage = 1;
let totalPages = 1; //! 임시. 이후 api 호출 시 재할당
let currentInput = '';

//* Render Functions
const createCardInnerHTML = ({
  author,
  description,
  priceStandard,
  publisher,
  title,
  cover,
  link,
}) => ` 
  <div class="img-wrap">
    <img
      src="${cover}"
      alt="도서 이미지"
    />
    <div class="desc-wrap">
    <p class="desc">
      ${
        description
          ? `${description.slice(0, 45)}...` // 45~100?
          : '이 책은 설명이 제공되지 않습니다.'
      }</p>
    </div>
  </div>
  <div class="tit">${title}</div>
  <div class="price">${priceStandard}원</div>
  <div class="card-footer">
    <span class="author">${author.split(',')[0].split(' ')[0]}</span>
    <span class="publisher">${publisher}</span>
    <i class="fa-regular fa-heart heart-btn btn"></i>
    <!-- todo 클릭 시 찜 -->
  </div>
  <a href="${link}" target="_blank"></a>
`;
const createCardComponent = ({
  isbn13,
  author,
  description,
  priceStandard,
  publisher,
  title,
  cover,
  link,
}) => {
  const $card = document.createElement('li');
  $card.classList.add('card');
  $card.dataset.isbn13 = isbn13;
  $card.innerHTML = createCardInnerHTML({
    author,
    description,
    priceStandard,
    publisher,
    title,
    cover,
    link,
  });
  if (bookStorage.includes({ isbn13 })) {
    // 찜한건 하트표시
    $card
      .querySelector('.heart-btn')
      .classList.replace('fa-regular', 'fa-solid');
  }
  return $card;
};
const renderBooks = ({ books, $parent = $cardCon }) => {
  $parent.replaceChildren();
  const $fragment = new DocumentFragment();
  books.forEach((book) => {
    const {
      isbn13,
      author,
      description,
      priceStandard,
      publisher,
      title,
      cover,
      link,
    } = book;
    const $card = createCardComponent({
      isbn13,
      author,
      description,
      priceStandard,
      publisher,
      title,
      cover,
      link,
    });
    $fragment.appendChild($card);
  });
  $parent.appendChild($fragment);
};

const renderLoader = () => {
  $modalWrap.classList.add('on');
  $loader.classList.add('on');
};
const removeLoader = () => {
  $modalWrap.classList.remove('on');
  $loader.classList.remove('on');
};

const openFavoriteModal = () => {
  $modalWrap.classList.add('on');
  $favoriteModal.classList.add('on');
  document.body.style.overflowY = 'hidden';
};
const closeFavoriteModal = () => {
  $modalWrap.classList.remove('on');
  $favoriteModal.classList.remove('on');
  document.body.style.overflowY = 'auto';
};
//* API Infos
const url = 'http://localhost:8080/api/';
const BOOKS_PER_PAGE = 16;

//* API Functions
/**
 *
 * @param {'search' | 'list'} endpoint
 * @param { string } query
 * @param {'Title' | 'Author' | 'Publisher' | 'Keyword'}
 * @returns
 */
// SearchTarget: searchTarget || 'Book', //* Book(기본값) : 도서,Foreign : 외국도서,Music : 음반,DVD : DVD,Used : 중고샵(도서/음반/DVD 등),eBook: 전자책,All : 위의 모든 타겟(몰),

const generateUrl = ({
  endpoint = '',
  query = '',
  queryType = '',
  searchTarget = '',
  itemId = '',
  page,
}) => {
  let params = new URLSearchParams();
  if (page) params.append('start', page);
  switch (endpoint) {
    case 'list':
      endpoint = 'list'; // 'list' 엔드포인트
      params.append('maxResults', BOOKS_PER_PAGE);
      break;
    case 'search':
      if (!query) {
        console.error('검색어를 입력하세요.');
        return;
      }
      endpoint = 'search'; // 'search' 엔드포인트
      if (query) params.append('query', query); // 검색 쿼리
      if (queryType) params.append('queryType', queryType); // 쿼리 타입
      if (searchTarget) params.append('searchTarget', searchTarget); // 검색 타겟
      params.append('maxResults', BOOKS_PER_PAGE);
      break;
    default:
      throw new Error('Invalid type');
    case 'lookup':
      if (itemId) params.append('itemId', itemId);
  }
  console.log({ params });
  // 기본 URL과 엔드포인트를 결합하고 쿼리 문자열을 추가
  return `${url}${endpoint}?${params.toString()}`;
};

const getBooks = async ({
  endpoint,
  query,
  page,
  itemId,
  triggerLoader = true,
}) => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (triggerLoader) renderLoader();
  try {
    const res = await fetch(generateUrl({ endpoint, query, page, itemId }));
    const data = await res.json();
    if (triggerLoader) removeLoader();
    totalPages = data.totalResults / BOOKS_PER_PAGE;
    console.log(data);
    return data.item;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//* Utility Functions
const generateSequentialNumbers = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const generatePaginationNumbers = ({ currentPage, totalPages }) => {
  if (totalPages <= 10) return generateSequentialNumbers(1, totalPages); //* 총 페이지 수가 10 이하인 경우 모든 페이지 번호 표시
  let start = Math.max(currentPage - 4, 1);
  let end = Math.min(start + 9, totalPages);
  start = Math.max(end - 9, 1); //* end가 totalPages에 도달했을 때, start를 조정
  return generateSequentialNumbers(start, end);
};

//* Paginations
const alignPage = ({ targetPage }) => {
  currentPage = targetPage;
  const newPaginationNumbers = generatePaginationNumbers({
    currentPage,
    totalPages,
  });
  console.log({ currentPage, newPaginationNumbers });
  [...$pageBtnCon.children].forEach(
    ($pageBtn) => ($pageBtn.style.display = 'none')
  );
  newPaginationNumbers.forEach((page) => {
    if ($pageBtnCon.children[page - 1])
      $pageBtnCon.children[page - 1].style.display = 'inline-block';
  });
};
const initializePaginationBtns = ({ totalPages }) => {
  $pageBtnCon.replaceChildren();
  const $fragment = new DocumentFragment();
  for (let page = 1; page <= totalPages; page++) {
    const $newPageBtn = document.createElement('button');
    if (page === 1) $newPageBtn.classList.add('on');
    $newPageBtn.classList.add('page-btn');
    $newPageBtn.classList.add('btn');
    $newPageBtn.dataset.page = page;
    $newPageBtn.textContent = page;
    $fragment.appendChild($newPageBtn);
  }
  $pageBtnCon.appendChild($fragment);
  alignPage({ targetPage: 1 });
};

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
  console.log($searchInput.value.trim(), currentInput);
  if ($searchInput.value.trim() === currentInput) return; //현재 검색어와 같은 검색어 입력시 무시
  if (!$searchInput.value.trim()) {
    //* 빈 문자열일 때
    const newBooks = await getBooks({ endpoint: 'list', page: 1, query: '' }); // 검색어 없으면 신간 도서 첫 페이지 불러오기
    initializePaginationBtns({ totalPages });
    currentEndpoint = 'list'; //! 여기서만 재할당됨
    renderBooks({ books: newBooks });
    $searchedWord.parentElement.style.display = 'none';
    currentInput = '';
    return;
  }
  const searchedBooks = await getBooks({
    query: $searchInput.value,
    endpoint: 'search',
    page: 1,
  });
  initializePaginationBtns({ totalPages });
  currentEndpoint = 'search'; //! 여기서만 재할당됨
  renderBooks({ books: searchedBooks });
  $searchedWord.parentElement.style.display = 'block';
  $searchedWord.textContent = $searchInput.value.trim();
  currentInput = $searchInput.value.trim();
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
//*inits
const init = async () => {
  $paginationCon.style.display = 'none';
  const newBooks = await getBooks({ page: 1, endpoint: 'list', query: '' }); //* 신간 도서 렌더링
  initializePaginationBtns({ totalPages });
  renderBooks({ books: newBooks });
  $paginationCon.style.display = 'flex';
  $searchInput.focus();
};
init();

//* Event Listeners
$cardCon.addEventListener('mouseup', onClickCardCon);
$favoriteCardCon.addEventListener('mouseup', onClickCardCon);
$paginationCon.addEventListener('mouseup', onClickPagination);
$searchForm.addEventListener('submit', onSubmit);
$favoriteBtn.addEventListener('mouseup', onClickFavoriteBtn);
$favoriteModal.addEventListener('mouseup', (e) => {
  const { target } = e;
  if (target.matches('.favorite-modal .close-btn')) {
    closeFavoriteModal();
  }
});
