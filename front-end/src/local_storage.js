class LocalStorage {
  #key;
  #books;
  constructor(key) {
    this.#key = key;
    this.#books = JSON.parse(localStorage.getItem(this.#key)) || [];
  }
  save() {
    localStorage.setItem(this.#key, JSON.stringify(this.#books));
  }
  getBooks() {
    return this.#books;
  }
  addBook({ isbn13 }) {
    if (this.includes({ isbn13 })) {
      console.error('이미 찜한 책이에요.');
      return false;
    } //* 혹시 모를 중복 예외처리, 20개 제한
    if (this.#books.length >= 20) {
      console.error('찜은 20개까지만 할 수 있어요!');
      return false;
    }
    this.#books = [...this.#books, isbn13];
    this.save();
    return isbn13; //* 저장된 값 반환
  }
  deleteBook({ isbn13 }) {
    if (!this.includes({ isbn13 })) return false; //* 삭제할 대상 없음
    this.#books = this.#books.filter((book) => book !== isbn13);
    this.save();
    return true; //* 삭제 성공
  }
  includes({ isbn13 }) {
    return this.#books.some((book) => book === isbn13);
  }
}
const bookStorage = new LocalStorage('books');
export default bookStorage;
