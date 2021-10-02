function listArticlesSuccess(list, page, count) {
	return { type: 'LIST_ARTICLES', list, page, count };
};

export function listArticles(page = 1, limit = 10) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles?page=${page}&limit=${limit}`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(listArticlesSuccess(responseJson.result, page, responseJson.count));
	};
};

function getArticleByTitleSuccess(article) {
	return { type: 'GET_ARTICLE_BY_TITLE', article };
};

export function getArticleByTitle(title) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles/title/${title}`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(getArticleByTitleSuccess(responseJson.result));
	};
};

function listArticlesByCategorySuccess(list, page, count) {
	return { type: 'LIST_ARTICLES_BY_CATEGORY', list, page, count };
};

export function listArticlesByCategory(category, page = 1, limit = 10) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles/category/${category}?page=${page}&limit=${limit}`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(listArticlesByCategorySuccess(responseJson.result, page, responseJson.count));
	};
};

function searchArticlesSuccess(list, page, count) {
	return { type: 'SEARCH_ARTICLES', list, page, count };
};

export function searchArticles(keyword, category, page = 1, limit = 10) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles/search?keyword=${keyword}&category=${category}&page=${page}&limit=${limit}`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(searchArticlesSuccess(responseJson.result, page, responseJson.count));
	};
};
