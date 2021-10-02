import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';

import { getArticleByTitle } from '../actions/article';
import { scrollToElement } from '../helper';
import Sidebar from './Sidebar';

export default class ArticleDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			title: this.props.match.params.title
		};
	}

	async componentDidMount() {
		await this.props.dispatch(getArticleByTitle(this.state.title));
		scrollToElement('article-details-wrapper');
	}

	render() {
		const { current } = this.props.article;
		return (
			<section className="ftco-section ftco-degree-bg" id="article-details-wrapper">
				<Helmet>
					<title>{current?.title}</title>
				</Helmet>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 ftco-animate fadeInUp ftco-animated">
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
						</div>
						<Sidebar {...this.props} />
					</div>
				</div>
			</section>
		);
	}

}