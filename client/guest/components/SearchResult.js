import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import qs from 'qs';
import { Helmet } from 'react-helmet';

import { searchArticles } from '../actions/article';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';
import { scrollToElement } from '../helpers';

export default class SearchResult extends Component {

	constructor(props) {
		super(props);
		const query = qs.parse(this.props.location?.search, { ignoreQueryPrefix: true });
		const category = query.caetegory ? query.category.split(',') : [];
		this.state = {
			activePage: query.page ? parseInt(query.page) : 1,
			category,
			keyword: query.keyword || ''
		};
	}

	async componentDidMount() {
		await this.props.dispatch(searchArticles(this.state.keyword, this.state.category.join(','), 1, 5));
		window.onload = () => {
			scrollToElement('articles-wrapper');
		}
	}

	async onPageChange(page) {
		await this.props.dispatch(searchArticles(this.state.keyword, this.state.category.join(','), page, 5));
		scrollToElement('articles-wrapper');
	}

	render() {
		return (
			<section className="ftco-section" id="articles-wrapper">
				<Helmet>
					<title>{this.props.article?.count.toString()} search result(s)</title>
				</Helmet>
				<div className="container">
					<div className="row">
						<div className="col-lg-8">
							<div className="row">
								{this.props.article.list.map((item) => (<ArticleItem {...item} key={item._id} />))}
							</div>
							<div className="row mt-5">
								<div className="col text-center">
									<div className="block-27">
										<Pagination
											innerClass='block-27'
											activePage={this.state.activePage}
											itemsCountPerPage={5}
											totalItemsCount={this.props.article.count}
											pageRangeDisplayed={3}
											onChange={this.onPageChange.bind(this)}
										/>
									</div>
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
