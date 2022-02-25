import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { getBriefHtmlContent } from '../helpers';

export default class ArticleItem extends Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		let { _id, title, content, coverImg, createdAt, authorId } = this.props;
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
							{getBriefHtmlContent(content)}
						</div>
						<div className="author mb-4 d-flex align-items-center">
							<Link to="#" className="img" style={{ backgroundImage: 'url("/assets/explore/images/person_1.jpg")' }}></Link>
							<div className="ml-3 info">
								<h3><Link to="#">{authorId?.fullName}</Link>, <span>{$.format.date(createdAt, "dd/MM/yyyy")}</span></h3>
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