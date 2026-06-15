import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import Article from './Article';
import ArticleEditor from './ArticleEditor';
import About from './About';
import Profile from './Profile';

export default function Main() {
	return (
		<Routes>
			<Route path='/dashboard/articles' element={<Article />} />
			<Route path='/dashboard/articles/:id' element={<ArticleEditor />} />
			<Route path='/dashboard/about' element={<About />} />
			<Route path='/dashboard/profile' element={<Profile />} />
			<Route path='/dashboard/*' element={<Home />} />
		</Routes>
	);
}
