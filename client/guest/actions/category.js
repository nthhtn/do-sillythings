function listCategoriesSuccess(list) {
	return { type: 'LIST_CATEGORIES', list };
};

export function listCategories() {
	return async (dispatch) => {
		const response = await fetch(`/api/categories`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(listCategoriesSuccess(responseJson.result));
	};
};