import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import About from './About';
import ArticleDetails from './ArticleDetails';
import ArticleInCategory from './ArticleInCategory';
import SearchResult from './SearchResult';

export default function Main() {
	return (
		<Routes>
			<Route path='/about' element={<About />} />
			<Route path='/articles/category/:category' element={<ArticleInCategory />} />
			<Route path='/articles/search' element={<SearchResult />} />
			<Route path='/articles/:title' element={<ArticleDetails />} />
			<Route path='*' element={<Home />} />
		</Routes>
	);
}
