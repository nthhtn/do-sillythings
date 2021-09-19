import { combineReducers } from 'redux';

import article from './article';
import user from './user';
import category from './category';

export default combineReducers({ article, user, category });
