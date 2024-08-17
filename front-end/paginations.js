import { $paginationCon, $pageBtnCon } from './elements.js';
import { setCurrentPage, currentPage, totalPages } from './states.js';
import { generatePaginationNumbers } from './utils.js';

//* Paginations
const alignPage = ({ targetPage }) => {
  setCurrentPage(targetPage);
  const newPaginationNumbers = generatePaginationNumbers({
    currentPage,
    totalPages,
  });
  [...$pageBtnCon.children].forEach(
    ($pageBtn) => ($pageBtn.style.display = 'none')
  );

  console.log(newPaginationNumbers, totalPages);
  newPaginationNumbers.forEach((page) => {
    if ($pageBtnCon.children[page - 1])
      $pageBtnCon.children[page - 1].style.display = 'inline-block';
  });
};
const initializePaginationBtns = ({ totalPages }) => {
  if (totalPages === 0) $paginationCon.style.display = 'none';
  else $paginationCon.style.display = 'flex';

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

export { alignPage, initializePaginationBtns };
