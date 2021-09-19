import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import ReactHtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';

import { listArticlesByCategory } from '../actions/article';
import { scrollToElement } from '../helper';
import Sidebar from './Sidebar';

class ArticleItem extends Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		const { _id, title, content, coverImg, createdAt, authorId } = this.props;
		return (
			<div className="col-md-12">
				<div className="blog-entry ftco-animate fadeInUp ftco-animated">
					<Link to={`/articles/${title}`} className="img"
						style={{
							backgroundImage: `url(${coverImg})`, backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat', backgroundPosition: 'center center'
						}}></Link>
					<div className="text pt-2 mt-5">
						<h3 className="mb-4"><Link to={`/articles/${title}`}>{title}</Link></h3>
						<div className="mb-4">
							{ReactHtmlParser(content)}
						</div>
						<div className="author mb-4 d-flex align-items-center">
							<Link to="#" className="img" style={{ backgroundImage: 'url("/assets/explore/images/person_1.jpg")' }}></Link>
							<div className="ml-3 info">
								<h3><Link to="#">{authorId?.fullName}</Link>, <span>{createdAt}</span></h3>
							</div>
						</div>
						<div className="meta-wrap d-md-flex align-items-center">
							<div className="half">
								<p><Link to={`/articles/${title}`} className="btn btn-primary p-3 px-xl-4 py-xl-3">Continue Reading</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

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
