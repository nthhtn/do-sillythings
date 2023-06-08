import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { Helmet } from 'react-helmet';

import { listArticlesByCategory } from '../actions/article';
import { scrollToElement } from '../helpers';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';

export default class ArticleInCategory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			category: this.props.match.params.category
		};
	}

	async componentDidMount() {
		await this.props.dispatch(listArticlesByCategory(this.state.category, 1, 5));
		window.onload = () => {
			scrollToElement('articles-wrapper');
		}
	}

	async onPageChange(page) {
		await this.props.dispatch(listArticlesByCategory(this.state.category, page, 5));
		this.setState({ activePage: page });
		scrollToElement('articles-wrapper');
	}

	render() {
		return (
			<section className="ftco-section" id="articles-wrapper">
				<Helmet>
					<title>{this.state.category}</title>
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
											totalItemsCount={this.props.article?.count}
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
