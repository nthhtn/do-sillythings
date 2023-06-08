import React, { Component } from 'react';
import Pagination from 'react-js-pagination';

import { listArticles } from '../actions/article';
import Sidebar from './Sidebar';
import ArticleItem from './ArticleItem';
import { scrollToElement } from '../helpers';

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = { activePage: 1 };
	}

	async componentDidMount() {
		await this.props.dispatch(listArticles(1, 5));
	}

	async onPageChange(page) {
		await this.props.dispatch(listArticles(page, 5));
		scrollToElement('articles-wrapper');
		this.setState({ activePage: page });
	}

	render() {
		return (
			<section className="ftco-section" id="articles-wrapper">
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
