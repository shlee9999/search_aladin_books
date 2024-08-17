import bookStorage from './local_storage.js';
import { $cardCon, $favoriteModal, $loader, $modalWrap } from './elements.js';

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
          ? `${description.slice(0, 100)}...` // 45~100?
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
export {
  closeFavoriteModal,
  createCardComponent,
  createCardInnerHTML,
  openFavoriteModal,
  removeLoader,
  renderBooks,
  renderLoader,
};
