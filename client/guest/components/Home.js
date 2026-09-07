import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';

import { listArticles } from '../actions/article';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';
import Loader from './Loader';
import { scrollToElement } from '../helpers';

export default function Home() {
	const dispatch = useDispatch();
	const article = useSelector((state) => state.article);
	const [activePage, setActivePage] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		dispatch(listArticles(1, 5)).then(() => setLoading(false));
	}, []);

	async function onPageChange(page) {
		setLoading(true);
		await dispatch(listArticles(page, 5));
		scrollToElement('articles-wrapper');
		setActivePage(page);
		setLoading(false);
	}

	return (
		<section className="ftco-section" id="articles-wrapper">
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
