import { BOOKS_PER_PAGE } from './constants.ts';
import { renderLoader, removeLoader } from './render.ts';
import { setTotalPages } from './states.ts';
import { BookInfo, GenerateUrlProps, GetBooksProps } from './types.ts';

//* API Infos
const url = 'http://localhost:8080/api/';

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
  endpoint,
  query,
  queryType,
  searchTarget,
  itemId,
  page,
}: GenerateUrlProps) => {
  let params = new URLSearchParams();
  if (page) params.append('start', page + '');
  switch (endpoint) {
    case 'list':
      params.append('maxResults', BOOKS_PER_PAGE + '');
      break;
    case 'search':
      if (!query) {
        console.error('검색어를 입력하세요.');
        return '';
      }
      if (query) params.append('query', query); // 검색 쿼리
      if (queryType) params.append('queryType', queryType); // 쿼리 타입
      if (searchTarget) params.append('searchTarget', searchTarget); // 검색 타겟
      params.append('maxResults', BOOKS_PER_PAGE + '');
      break;
    case 'lookup':
      if (itemId) params.append('itemId', itemId);
      break;

    default:
      throw new Error('Invalid type');
  }
  // console.log({ params });
  // 기본 URL과 엔드포인트를 결합하고 쿼리 문자열을 추가
  return `${url}${endpoint}?${params.toString()}`;
};

const getBooks = async ({
  endpoint,
  query,
  page,
  itemId,
  triggerLoader = true,
}: GetBooksProps): Promise<BookInfo[]> => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (triggerLoader) renderLoader();
  try {
    const res = await fetch(generateUrl({ endpoint, query, page, itemId }));
    const data = await res.json();
    if (triggerLoader) removeLoader();
    setTotalPages(Math.ceil(data.totalResults / BOOKS_PER_PAGE));
    // console.log(data);
    return data.item;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export { getBooks };
