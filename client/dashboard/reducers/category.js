const list = [];

export default function (state = { list }, action) {
	switch (action.type) {
		case 'LIST_CATEGORIES': return { ...state, list: action.list };
		default: return state;
	}
};
