// redux/actions.js
export const SET_CURRENT_ARTICLE = 'SET_CURRENT_ARTICLE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

export const setCurrentArticle = (slug) => ({
  type: SET_CURRENT_ARTICLE,
  payload: slug,
});

export const setCurrentPage = (filter) => ({
  type: SET_CURRENT_PAGE,
  payload: filter
});
