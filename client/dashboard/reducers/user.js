const me = null;
const error = null;

export default function (state = { me, error }, action) {
	switch (action.type) {
		case 'GET_MY_PROFILE': return { ...state, me: action.result };
		case 'UPDATE_MY_PROFILE': return { ...state, me: { ...me, ...action.result }, error: null };
		case 'UPDATE_MY_PROFILE_ERROR': return { ...state, error: action.error };
		default: return state;
	}
};
