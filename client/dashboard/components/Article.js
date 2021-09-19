import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Pagination from 'react-js-pagination';
import { Typeahead, TypeaheadMenu } from 'react-bootstrap-typeahead';

import { listArticles, createArticle, updateArticle, getArticle } from '../actions/article';
import { listCategories } from '../actions/category';

class ArticleTable extends Component {

	constructor(props) {
		super(props);
		this.state = { activePage: 1 };
	}

	onRowClick(row) {
		this.props.changeMode('edit', row);
	}

	async onPageChange(page) {
		this.props.dispatch(listArticles(page, 10));
		this.setState({ activePage: page });
	}

	render() {
		const list = this.props.article.list.map((item) => {
			let span = document.createElement('span');
			span.innerHTML = item.content;
			item.content = span.innerText;
			return item;
		});
		const options = {
			onRowClick: this.onRowClick.bind(this)
		};
		const showCategoryDisplayName = (cell, row) => {
			return cell.displayName;
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
							<button type="button" className="btn btn-success mr-1 mb-3"
								onClick={() => this.props.changeMode('add')}>
								<i className="fa fa-fw fa-plus mr-1"></i> Write New Article
							</button>
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

class ArticleEditor extends Component {

	constructor(props) {
		super(props);
		const { contentBlocks, entityMap } = convertFromHTML(this.props.content);
		const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
		this.state = {
			editorState: EditorState.createWithContent(contentState),
			coverImg: '',
			file: null,
			tagOptions: [],
			tagSelected: []
		};
	}

	async componentDidMount() {
		await this.props.dispatch(listCategories());
		if (this.props.editorMode == 'edit' && this.props.articleId) {
			await this.props.dispatch(getArticle(this.props.articleId));
			const { current } = this.props.article;
			this.setState({
				coverImg: current?.coverImg,
				tagOptions: current?.tags,
				tagSelected: current?.tags
			});
			$('#input-title').val(current?.title);
			$('#input-category').val(current?.categoryId);
		}
	}

	onEditorChange(editorState) {
		this.setState({ editorState });
	}

	previewCoverImg(e) {
		e.target.files && e.target.files.length > 0 &&
			this.setState({ coverImg: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
	}

	async createArticle() {
		const title = $('#input-title').val().trim();
		const contentState = this.state.editorState.getCurrentContent();
		const content = stateToHTML(contentState);
		const file = this.state.file;
		const categoryId = $('#input-category').val().trim();
		const tags = this.state.tagSelected;
		if (!title || !content || !file || categoryId == '0') {
			return $('.input-error').html('Missing required field(s)');
		}
		$('.input-error').html('');
		await this.props.dispatch(createArticle({ title, content, file: this.state.file, categoryId, tags }));
		this.props.changeMode('view', { _id: null, title: '', content: '' });
		this.refs.inputTag.clear();
	}

	async updateArticle() {
		const id = this.props.articleId;
		const title = $('#input-title').val().trim();
		const contentState = this.state.editorState.getCurrentContent();
		const content = stateToHTML(contentState);
		const categoryId = $('#input-category').val().trim();
		const tags = this.state.tagSelected;
		if (!title || !content || categoryId == '0') {
			return $('.input-error').html('Missing required field(s)');
		}
		await this.props.dispatch(updateArticle(id, { title, content, file: null, categoryId, tags }));
		this.props.changeMode('view', { _id: null, title: '', content: '' });
	}

	onTagChange(selected) {
		this.setState({
			tagOptions: selected,
			tagSelected: selected
		});
	}

	onTagInputChange(string, e) {
		if (string.indexOf(',') >= 0) {
			const newtag = { _id: '', tagValue: string.split(',')[0].trim() };
			this.refs.inputTag.clear();
			this.setState({
				tagOptions: [...this.state.tagOptions, newtag],
				tagSelected: [...this.state.tagSelected, newtag]
			});
		}
	}

	render() {
		const { editorState, coverImg } = this.state;
		const listCategories = this.props.category?.list;
		const tagState = {
			options: this.state.tagOptions,
			selected: this.state.tagSelected
		};
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">Write a new article</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block">
						<div className="block-content block-content-full">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label htmlFor="input-title">Blog title *</label>
										<input type="text" className="form-control" id="input-title" placeholder="Title" />
									</div>
									<Editor
										wrapperClassName="wrapper-class"
										editorClassName="editor-class"
										toolbarClassName="toolbar-class"
										editorStyle={{
											padding: "0 12px", borderRadius: "2px", border: "1px solid #F1F1F1",
											minHeight: "500px", maxHeight: "800px"
										}}
										editorState={editorState}
										ref='contentEditor'
										onEditorStateChange={this.onEditorChange.bind(this)}
									/>
									<div className="row">
										<div className="form-group col-md-12">
											<label htmlFor="input-tag">Tags (delimited by ,)</label>
											<Typeahead
												{...tagState}
												id="input-tag"
												multiple
												labelKey="tagValue"
												ref='inputTag'
												onChange={this.onTagChange.bind(this)}
												onInputChange={this.onTagInputChange.bind(this)}
												renderMenu={(results, menuProps) => {
													// Hide the menu when there are no results.
													if (!results.length) {
														return null;
													}
													return <TypeaheadMenu {...menuProps} options={results} />;
												}}
											/>
										</div>
									</div>
									<div className="row" style={{ margin: 0 }}>
										<div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
											<label>Category *</label>
											<select className="custom-select" id="input-category">
												<option value="0">Please select</option>
												{listCategories.map((category) =>
													(<option key={category._id} value={category._id}>{category.displayName}</option>))
												}
											</select>
										</div>
										<div className="form-group col-md-6">
											<label className="d-block" htmlFor="input-image">Cover image *</label>
											<input type="file" id="input-image" accept='image/*' onChange={this.previewCoverImg.bind(this)} />
										</div>
									</div>
								</div>
								<div className="col-md-6">
									{coverImg && <img src={coverImg} style={{ maxWidth: '100%' }} />}
								</div>
								<div className="form-group col-md-6">
									<label className="d-block input-error" style={{ color: 'red' }}></label>
								</div>
							</div>

							<button type="button" className="btn btn-primary mr-1 mb-3"
								onClick={this.props.editorMode === 'add' ? this.createArticle.bind(this) : this.updateArticle.bind(this)}>
								<i className="fa fa-plus-square mr-1"></i> Submit
							</button>
							<button type="button" className="btn btn-secondary mr-1 mb-3" onClick={() => this.props.changeMode('view')}>
								<i className="fa fa-stop-circle mr-1"></i> Cancel
							</button>
						</div>
					</div>
				</div>
			</main>
		);
	}

}

export default class ArticleView extends Component {

	constructor(props) {
		super(props);
		this.state = { mode: 'view', _id: null, title: '', content: '' };
	}

	componentDidMount() {
		this.props.dispatch(listArticles());
	}

	changeMode(mode, data) {
		this.setState({ ...this.state, ...data, mode });
	}

	render() {
		const { mode, _id, title, content } = this.state;
		return mode === 'view' ?
			(<ArticleTable changeMode={this.changeMode.bind(this)} {...this.props} />) :
			(<ArticleEditor changeMode={this.changeMode.bind(this)} {...this.props} editorMode={mode}
				articleId={_id} title={title} content={content} />);
	}

};
