const list = [];
const current = null;
const page = 1;
const count = 0;

export default function (state = { list, current, page, count }, action) {
	switch (action.type) {
		case 'CREATE_ARTICLE': return { ...state, list: [action.article, ...state.list] };
		case 'LIST_ARTICLES': return { ...state, list: action.list, page: action.page, count: action.count };
		case 'GET_ARTICLE': return { ...state, current: action.article };
		case 'UPDATE_ARTICLE': return {
			...state,
			list: state.list.map((item) => (item._id === action.article._id ? action.article : item))
		};
		case 'DELETE_ARTICLE': return {
			...state,
			list: state.list.filter((item) => (item._id != action.articleId))
		};
		default: return state;
	}
};
