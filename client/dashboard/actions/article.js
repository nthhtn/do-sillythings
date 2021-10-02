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

function createArticleSuccess(article) {
	return { type: 'CREATE_ARTICLE', article };
};

export function createArticle(article) {
	return async (dispatch) => {
		let formdata = new FormData();
		Object.keys(article).map((key) => key === 'tags' ?
			formdata.append(key, JSON.stringify(article.tags.map((tag) => (tag.tagValue))))
			: formdata.append(key, article[key]));
		const response = await fetch(`/api/articles`, {
			credentials: 'same-origin',
			method: 'post',
			body: formdata
		});
		const responseJson = await response.json();
		return dispatch(createArticleSuccess(responseJson.result));
	};
};

function getArticleSuccess(article) {
	return { type: 'GET_ARTICLE', article };
};

export function getArticle(id) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles/${id}`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(getArticleSuccess(responseJson.result));
	};
};

function updateArticleSuccess(article) {
	return { type: 'UPDATE_ARTICLE', article };
};

export function updateArticle(id, article) {
	return async (dispatch) => {
		let options;
		if (article.file) {
			let formdata = new FormData();
			Object.keys(article).map((key) => key === 'tags' ?
				formdata.append(key, JSON.stringify(article.tags.map((tag) => (tag.tagValue))))
				: formdata.append(key, article[key]));
			options = { credentials: 'same-origin', method: 'put', body: formdata };
		}
		else {
			article.tags = article.tags.map((tag) => (tag.tagValue));
			options = { credentials: 'same-origin', method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(article) };
		}
		const response = await fetch(`/api/articles/${id}`, options);
		const responseJson = await response.json();
		return dispatch(updateArticleSuccess(responseJson.result));
	};
};

function deleteArticleSuccess(articleId) {
	return { type: 'DELETE_ARTICLE', articleId };
};

export function deleteArticle(id) {
	return async (dispatch) => {
		const response = await fetch(`/api/articles/${id}`, {
			credentials: 'same-origin',
			method: 'delete',
			headers: { 'Content-Type': 'application/json' }
		});
		const responseJson = await response.json();
		return dispatch(deleteArticleSuccess(id));
	};
};
