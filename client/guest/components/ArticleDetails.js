import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';

import { getArticleByTitle } from '../actions/article';
import { scrollToElement } from '../helpers';
import Sidebar from './Sidebar';
import Loader from './Loader';

export default function ArticleDetails() {
	const { title } = useParams();
	const dispatch = useDispatch();
	const article = useSelector((state) => state.article);
	const { current } = article;
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		dispatch(getArticleByTitle(title)).then(() => {
			scrollToElement('article-details-wrapper');
			setLoading(false);
		});
	}, [title]);

	return (
		<section className="ftco-section ftco-degree-bg" id="article-details-wrapper">
			<Helmet>
				<title>{current?.title}</title>
			</Helmet>
			<div className="container">
				<div className="row">
					<div className="col-lg-8 ftco-animate fadeInUp ftco-animated">
						{loading ? <Loader /> : (
							<>
								<h2 className="mb-3 font-weight-bold">{current?.title}</h2>
								{current && <p><img src={current.coverImg} alt="" className="img-fluid" /></p>}
								{ReactHtmlParser(current?.content)}
								<div className="tag-widget post-tag-container mb-5 mt-5">
									<div className="tagcloud">
										{current?.tags.map((tag) => (
											<a href="#" key={tag.tagValue} className="tag-cloud-link">{tag.tagValue}</a>
										))}
									</div>
								</div>
								<div className="about-author d-flex p-4 bg-light">
									<div className="bio mr-5">
										<img src={current?.authorId.avatar} alt="Image placeholder" className="img-fluid mb-4" style={{ maxWidth: '200px', resize: 'auto' }} />
									</div>
									<div className="desc">
										<h3>{current?.authorId.fullName}</h3>
										<p>{current?.authorId.brief}</p>
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
