import { $paginationCon, $pageBtnCon } from './elements.ts';
import { setCurrentPage, currentPage, totalPages } from './states.ts';
import { generatePaginationNumbers } from './utils.ts';

//* Paginations
const alignPage = ({ targetPage }: { targetPage: number }) => {
  setCurrentPage(targetPage);
  const newPaginationNumbers = generatePaginationNumbers({
    currentPage,
    totalPages,
  });
  ([...$pageBtnCon.children] as HTMLButtonElement[]).forEach(
    ($pageBtn) => ($pageBtn.style.display = 'none')
  );

  console.log(newPaginationNumbers, totalPages);
  newPaginationNumbers.forEach((page) => {
    const $pageBtn = $pageBtnCon.children[page - 1] as HTMLButtonElement;
    $pageBtn.style.display = 'inline-block';
  });
};
const initializePaginationBtns = ({ totalPages }: { totalPages: number }) => {
  if (totalPages === 0) $paginationCon.style.display = 'none';
  else $paginationCon.style.display = 'flex';

  $pageBtnCon.replaceChildren();
  const $fragment = new DocumentFragment();
  for (let page = 1; page <= totalPages; page++) {
    const $newPageBtn = document.createElement('button');
    if (page === 1) $newPageBtn.classList.add('on');
    $newPageBtn.classList.add('page-btn');
    $newPageBtn.classList.add('btn');
    $newPageBtn.dataset.page = page + '';
    $newPageBtn.textContent = page + '';
    $fragment.appendChild($newPageBtn);
  }
  $pageBtnCon.appendChild($fragment);
  alignPage({ targetPage: 1 });
};

export { alignPage, initializePaginationBtns };
