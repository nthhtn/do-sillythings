import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'sweetalert2/dist/sweetalert2.css';

import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Typeahead, TypeaheadMenu } from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

import { createArticle, updateArticle, getArticle } from '../actions/article';
import { listCategories } from '../actions/category';

export default class ArticleEditor extends Component {

	constructor(props) {
		super(props);
		const { contentBlocks, entityMap } = convertFromHTML(this.props.content || '');
		const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
		const id = this.props.match?.params?.id;
		const articleId = !!id && id != 'new' ? id : null;
		this.state = {
			articleId,
			new: articleId == null,
			editorState: EditorState.createWithContent(contentState),
			coverImg: '',
			file: null,
			tagOptions: [],
			tagSelected: [],
			done: false
		};
	}

	async componentDidMount() {
		await this.props.dispatch(listCategories());
		if (!this.state.new) {
			await this.props.dispatch(getArticle(this.props.match.params.id));
			const { current } = this.props.article;
			const { contentBlocks, entityMap } = convertFromHTML(current.content || '');
			const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
			this.setState({
				editorState: EditorState.createWithContent(contentState),
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
		this.refs.inputTag.clear();
		this.setState({ done: true });
	}

	async updateArticle() {
		const id = this.state.articleId;
		const title = $('#input-title').val().trim();
		const contentState = this.state.editorState.getCurrentContent();
		const content = stateToHTML(contentState);
		const categoryId = $('#input-category').val().trim();
		const tags = this.state.tagSelected;
		if (!title || !content || categoryId == '0') {
			return $('.input-error').html('Missing required field(s)');
		}
		console.log(tags);
		// await this.props.dispatch(updateArticle(id, { title, content, file: this.state.file, categoryId, tags }));
		this.setState({ done: true });
	}

	backToArticleTable() {
		Swal.fire({
			text: 'Are you sure to come back to table view?',
			title: 'You will lose all your changes!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				this.setState({ done: true });
			}
		});
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
		if (this.state.done) {
			return <Redirect to='/dashboard/articles' />
		}
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
								onClick={this.state.new ? this.createArticle.bind(this) : this.updateArticle.bind(this)}>
								<i className="fa fa-plus-square mr-1"></i> Submit
							</button>
							<button type="button" className="btn btn-secondary mr-1 mb-3" onClick={this.backToArticleTable.bind(this)}>
								<i className="fa fa-stop-circle mr-1"></i> Cancel
							</button>
						</div>
					</div>
				</div>
			</main>
		);
	}

}
