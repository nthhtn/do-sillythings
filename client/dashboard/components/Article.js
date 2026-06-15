import React, { useState, useEffect } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { listArticles } from '../actions/article';
import { getBriefHtmlContent } from '../helpers';

export default function Article() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const article = useSelector((state) => state.article);
	const [activePage, setActivePage] = useState(1);

	useEffect(() => {
		dispatch(listArticles());
	}, []);

	function onRowClick(row) {
		navigate(`/dashboard/articles/${row._id}`);
	}

	async function onPageChange(page) {
		dispatch(listArticles(page, 10));
		setActivePage(page);
	}

	const list = article.list.map((item) => ({
		...item,
		content: getBriefHtmlContent(item.content),
		createdAt: new Date(item.createdAt).toLocaleString('en-GB', { hour12: false })
	}));

	const showCategoryDisplayName = (cell) => cell.displayName;

	const options = { onRowClick };

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
							activePage={activePage}
							itemsCountPerPage={10}
							totalItemsCount={article?.count}
							pageRangeDisplayed={3}
							onChange={onPageChange}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
