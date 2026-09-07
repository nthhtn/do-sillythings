import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';
import qs from 'qs';
import { Helmet } from 'react-helmet';

import { searchArticles } from '../actions/article';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';
import Loader from './Loader';
import { scrollToElement } from '../helpers';

export default function SearchResult() {
	const location = useLocation();
	const dispatch = useDispatch();
	const article = useSelector((state) => state.article);

	const query = qs.parse(location.search, { ignoreQueryPrefix: true });
	const categoryFromQuery = query.category ? query.category.split(',') : [];
	const keywordFromQuery = query.keyword || '';

	const [activePage, setActivePage] = useState(query.page ? parseInt(query.page) : 1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		dispatch(searchArticles(keywordFromQuery, categoryFromQuery.join(','), 1, 5)).then(() => {
			window.onload = () => scrollToElement('articles-wrapper');
			setLoading(false);
		});
	}, [location.search]);

	async function onPageChange(page) {
		setLoading(true);
		await dispatch(searchArticles(keywordFromQuery, categoryFromQuery.join(','), page, 5));
		setActivePage(page);
		scrollToElement('articles-wrapper');
		setLoading(false);
	}

	return (
		<section className="ftco-section" id="articles-wrapper">
			<Helmet>
				<title>{article?.count?.toString()} search result(s)</title>
			</Helmet>
			<div className="container">
				<div className="row">
					<div className="col-lg-8">
						{loading ? <Loader /> : (
							<>
								<div className="row">
									{article.list.map((item) => (<ArticleItem {...item} key={item._id} />))}
								</div>
								<div className="row mt-5">
									<div className="col text-center">
										<div className="block-27">
											<Pagination
												innerClass='block-27'
												activePage={activePage}
												itemsCountPerPage={5}
												totalItemsCount={article.count}
												pageRangeDisplayed={3}
												onChange={onPageChange}
											/>
										</div>
									</div>
								</div>
							</>
						)}
					</div>
					<Sidebar />
				</div>
			</div>
		</section>
	);
}
