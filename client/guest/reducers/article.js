const list = [];
const current = null;
const page = 1;
const count = 0;

export default function (state = { list, current, page, count }, action) {
	switch (action.type) {
		case 'LIST_ARTICLES': return { ...state, list: action.list, page: action.page, count: action.count };
		case 'GET_ARTICLE_BY_TITLE': return { ...state, current: action.article };
		case 'LIST_ARTICLES_BY_CATEGORY': return { ...state, list: action.list, page: action.page, count: action.count };
		case 'SEARCH_ARTICLES': return { ...state, list: action.list, page: action.page, count: action.count };
		default: return state;
	}
};
