import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';
import { Link, Redirect } from 'react-router-dom';

import { listArticles } from '../actions/article';

export default class Article extends Component {

	constructor(props) {
		super(props);
		this.state = { activePage: 1, editorUrl: null };
	}

	onRowClick(row) {
		const editorUrl = `/dashboard/articles/${row._id}`;
		this.setState({ editorUrl });
	}

	async onPageChange(page) {
		this.props.dispatch(listArticles(page, 10));
		this.setState({ activePage: page });
	}

	componentDidMount() {
		this.props.dispatch(listArticles());
	}

	render() {
		if (this.state.editorUrl) {
			return <Redirect to={this.state.editorUrl} />
		}
		const list = this.props.article.list.map((item) => {
			let span = document.createElement('span');
			span.innerHTML = item.content;
			item.content = span.innerText;
			return item;
		});
		const showCategoryDisplayName = (cell, row) => {
			return cell.displayName;
		};
		const options = {
			onRowClick: this.onRowClick.bind(this)
		};
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">List of Articles</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block">
						<div className="block-content">
							<Link type="button" className="btn btn-success mr-1 mb-3" to='/dashboard/articles/new'>
								<i className="fa fa-fw fa-plus mr-1"></i> Write New Article
							</Link>
							<BootstrapTable data={list} hover options={options} bodyStyle={{ cursor: 'pointer' }}>
								<TableHeaderColumn dataField='_id' isKey={true} hidden></TableHeaderColumn>
								<TableHeaderColumn dataField='title' columnClassName="font-w600" width="20%"
									tdStyle={{
										color: '#5c80d1',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										maxWidth: 0
									}}>
									Title
								</TableHeaderColumn>
								<TableHeaderColumn dataField='content' width="30%" columnClassName="article-brief"
									tdStyle={{
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										maxWidth: 0
									}}>
									Brief Content
								</TableHeaderColumn>
								<TableHeaderColumn width="20%" columnClassName="article-category" dataField='categoryId' dataFormat={showCategoryDisplayName}
									tdStyle={{
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										maxWidth: 0
									}}>
									Category
								</TableHeaderColumn>
								<TableHeaderColumn dataField='createdAt' width="30%">Created At</TableHeaderColumn>
							</BootstrapTable>
							<Pagination
								itemClass="page-item"
								linkClass="page-link"
								activePage={this.state.activePage}
								itemsCountPerPage={10}
								totalItemsCount={this.props.article?.count}
								pageRangeDisplayed={3}
								onChange={this.onPageChange.bind(this)}
							/>
						</div>
					</div>
				</div>
			</main>
		);
	}

};
