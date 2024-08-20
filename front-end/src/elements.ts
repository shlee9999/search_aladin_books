//* DOM Elements
const $cardCon = document.querySelector('.cards') as HTMLUListElement;
const $paginationCon = document.querySelector(
  '.pagination-con'
) as HTMLDivElement;
const $pageBtnCon = $paginationCon?.querySelector(
  '.page-btn-con'
) as HTMLDivElement;
const $searchForm = document.querySelector('.search-form') as HTMLFormElement;
const $searchInput = $searchForm[0] as HTMLInputElement;
const $searchedWord = document.querySelector(
  '.searched-word'
) as HTMLSpanElement;
const $favoriteModal = document.querySelector(
  '.favorite-modal'
) as HTMLDivElement;
const $favoriteCardCon = $favoriteModal?.querySelector(
  '.favorite-cards'
) as HTMLUListElement;
const $favoriteBtn = document.querySelector(
  '.favorite-btn'
) as HTMLButtonElement;
const $headerLogo = document.querySelector(
  'svg.header-logo'
) as HTMLOrSVGImageElement;
const $modalWrap = document.querySelector('.modal-wrap') as HTMLDivElement;
const $loader = document.querySelector('.loader') as HTMLSpanElement;
const $delAllPopup = document.querySelector('.del_all-popup') as HTMLDivElement;
const $floatingBtnCon = document.querySelector(
  '.floating-btn-con'
) as HTMLDivElement;
export {
  $cardCon,
  $favoriteBtn,
  $favoriteCardCon,
  $favoriteModal,
  $headerLogo,
  $loader,
  $modalWrap,
  $pageBtnCon,
  $paginationCon,
  $searchForm,
  $searchInput,
  $searchedWord,
  $delAllPopup,
  $floatingBtnCon,
};
