import { BaseApiProps } from './types';

//* States
let currentEndpoint: BaseApiProps['endpoint'] = 'list';
let currentPage = 1;
let totalPages = 1; //! 임시. 이후 api 호출 시 재할당
let currentInput = '';
const setCurrentEndpoint = (input: BaseApiProps['endpoint']) =>
  (currentEndpoint = input);
const setCurrentPage = (input: number) => (currentPage = input);
const setTotalPages = (input: number) => (totalPages = input);
const setCurrentInput = (input: string) => (currentInput = input);
export {
  currentEndpoint,
  currentInput,
  currentPage,
  totalPages,
  setCurrentEndpoint,
  setCurrentInput,
  setCurrentPage,
  setTotalPages,
};
