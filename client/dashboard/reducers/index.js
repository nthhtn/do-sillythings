import { combineReducers } from 'redux';

import article from './article';
import category from './category';
import user from './user';

export default combineReducers({ article, category, user });
