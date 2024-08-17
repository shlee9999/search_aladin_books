//* DOM Elements
const $cardCon = document.querySelector('.cards');
const $paginationCon = document.querySelector('.pagination-con');
const $pageBtnCon = $paginationCon.querySelector('.page-btn-con');
const $searchForm = document.querySelector('.search-form');
const $searchInput = $searchForm[0];
const $searchedWord = document.querySelector('.searched-word');
const $favoriteModal = document.querySelector('.favorite-modal');
const $favoriteCardCon = $favoriteModal.querySelector('.favorite-cards');
const $favoriteBtn = document.querySelector('.favorite-btn');
const $headerLogo = document.querySelector('svg.header-logo');
const $modalWrap = document.querySelector('.modal-wrap');
const $loader = document.querySelector('.loader');
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
};
