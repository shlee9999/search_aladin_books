// npm i express cors axios dotenv

require('dotenv').config();
const { API_URL, API_TTB } = process.env;
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 8080;

app.use(cors());

app.get('/api/search', async (req, res) => {
  try {
    console.log(req.query);
    const { query, queryType, maxResults, start, searchTarget } = req.query;
    const response = await axios.get(API_URL + 'ItemSearch.aspx', {
      params: {
        ttbkey: API_TTB, //! 키값 필수
        Query: query || '', //! 검색어 필수
        QueryType: queryType || 'Title', //* Keyword (기본값) : 제목+저자,Title : 제목검색,Author : 저자검색,Publisher : 출판사검색,
        MaxResults: maxResults || 10, //* 검색결과 한 페이지당 최대 출력 개수
        start: start || 1, //* 검색결과 시작페이지
        SearchTarget: searchTarget || 'Book', //* Book(기본값) : 도서,Foreign : 외국도서,Music : 음반,DVD : DVD,Used : 중고샵(도서/음반/DVD 등),eBook: 전자책,All : 위의 모든 타겟(몰),
        output: 'js', //* XML(기본값) : REST XML형식, JS: JSON방식,
        Version: '20131101',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'An error occurred while fetching data from Aladin Search API',
    });
  }
});

app.get('/api/list', async (req, res) => {
  try {
    console.log(req.query);
    const { queryType, searchTarget, start, maxResults } = req.query;
    const response = await axios.get(API_URL + 'ItemList.aspx', {
      params: {
        ttbkey: API_TTB, //! 키값 필수
        QueryType: queryType || 'ItemNewSpecial', //! 필수 ItemNewAll : 신간 전체 리스트, ItemNewSpecial : 주목할 만한 신간 리스트, ItemEditorChoice : 편집자 추천 리스트, (카테고리로만 조회 가능 - 국내도서/음반/외서만 지원), Bestseller : 베스트셀러, BlogBest : 블로거 베스트셀러 (국내도서만 조회 가능),
        MaxResults: maxResults || 10, //* 검색결과 한 페이지당 최대 출력 개수
        start: start || 1, //* 검색결과 시작페이지
        SearchTarget: searchTarget || 'Book', //* Book(기본값) : 도서,Foreign : 외국도서,Music : 음반,DVD : DVD,Used : 중고샵(도서/음반/DVD 등),eBook: 전자책,All : 위의 모든 타겟(몰),
        output: 'JS', //* XML(기본값) : REST XML형식, JS: JSON방식,
        Version: '20131101',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'An error occurred while fetching data from Aladin List API',
    });
  }
});

//todo lookup api 안됨
app.get('/api/lookup', async (req, res) => {
  try {
    console.log(req.query);
    const { itemId } = req.query;
    console.log(itemId);
    const response = await axios.get(API_URL + 'ItemLookUp.aspx', {
      params: {
        ttbkey: API_TTB, //! 키값 필수
        ItemId: itemId,
        Version: '20131101',
        Output: 'JS',
      },
    });
    console.log('response data', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'An error occurred while fetching data from Aladin Lookup API',
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
