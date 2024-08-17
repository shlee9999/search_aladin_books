export interface BaseApiProps {
  endpoint: 'search' | 'list' | 'lookup';
  query?: string;
  page?: number;
  itemId?: string;
}

export interface GenerateUrlProps extends BaseApiProps {
  queryType?: 'Title' | 'Author' | 'Publisher' | 'Keyword';
  searchTarget?:
    | 'Book'
    | 'Foreign'
    | 'Music'
    | 'DVD'
    | 'Used'
    | 'eBook'
    | 'All';
}

export interface GetBooksProps extends BaseApiProps {
  triggerLoader?: boolean;
  triggerScroll?: boolean;
}

export interface BookInfo {
  isbn13: string;
  author: string;
  description: string;
  priceStandard: number;
  publisher: string;
  title: string;
  cover: string; //* 이미지 URL
  link: string;
}
