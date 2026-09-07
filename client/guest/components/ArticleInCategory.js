import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Helmet } from 'react-helmet';

import { listArticlesByCategory } from '../actions/article';
import { scrollToElement } from '../helpers';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';
import Loader from './Loader';

export default function ArticleInCategory() {
	const { category } = useParams();
	const dispatch = useDispatch();
	const article = useSelector((state) => state.article);
	const [activePage, setActivePage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		dispatch(listArticlesByCategory(category, 1, 5)).then(() => {
			window.onload = () => scrollToElement('articles-wrapper');
			setLoading(false);
		});
	}, [category]);

	async function onPageChange(page) {
		setLoading(true);
		await dispatch(listArticlesByCategory(category, page, 5));
		setActivePage(page);
		scrollToElement('articles-wrapper');
		setLoading(false);
	}

	return (
		<section className="ftco-section" id="articles-wrapper">
			<Helmet>
				<title>{category}</title>
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
												totalItemsCount={article?.count}
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
