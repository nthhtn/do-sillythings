function getMyProfileSuccess(result) {
	return { type: 'GET_MY_PROFILE', result };
};

export function getMyProfile() {
	return async (dispatch) => {
		const response = await fetch(`/api/users/me`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		return dispatch(getMyProfileSuccess(responseJson.result));
	};
};

function updateMyProfileSuccess(result) {
	return { type: 'UPDATE_MY_PROFILE', result };
};

function updateMyProfileError(response) {
	return { type: 'UPDATE_MY_PROFILE_ERROR', error: response.error };
};

export function updateMyProfile(me) {
	return async (dispatch) => {
		let options;
		if (me.file) {
			let formdata = new FormData();
			Object.keys(me).map((key) => formdata.append(key, me[key]));
			options = { credentials: 'same-origin', method: 'put', body: formdata };
		}
		else {
			options = { credentials: 'same-origin', method: 'put', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(me) };
		}
		return await fetch(`/api/users/me`, options)
			.then(async (response) => {
				if (response.ok) {
					const responseJson = await response.json();
					return dispatch(updateMyProfileSuccess(responseJson.result));
				}
				const error = await response.text();
				return dispatch(updateMyProfileError(JSON.parse(error)));
			})
	};
}