//* States
let currentEndpoint = 'list';
let currentPage = 1;
let totalPages = 1; //! 임시. 이후 api 호출 시 재할당
let currentInput = '';
const setCurrentEndpoint = (input) => (currentEndpoint = input);
const setCurrentPage = (input) => (currentPage = input);
const setTotalPages = (input) => (totalPages = input);
const setCurrentInput = (input) => (currentInput = input);
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
