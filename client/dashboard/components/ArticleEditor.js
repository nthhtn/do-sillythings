import 'sweetalert2/dist/sweetalert2.css';

import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Typeahead, TypeaheadMenu } from 'react-bootstrap-typeahead';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

import { createArticle, updateArticle, getArticle } from '../actions/article';
import { listCategories } from '../actions/category';

export default class ArticleEditor extends Component {

	constructor(props) {
		super(props);
		const id = this.props.match?.params?.id;
		const articleId = !!id && id != 'new' ? id : null;
		this.state = {
			articleId,
			new: articleId == null,
			content: '',
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
			this.setState({
				content: current?.content || '',
				coverImg: current?.coverImg,
				tagOptions: current?.tags,
				tagSelected: current?.tags
			});
			$('#input-title').val(current?.title);
			$('#input-category').val(current?.categoryId);
		}
	}

	onEditorChange(e) {
		// this.setState({ content: e.target.getContent() });
		this.refs.inputContent.currentContent = e.target.getContent();
	}

	previewCoverImg(e) {
		e.target.files && e.target.files.length > 0 &&
			this.setState({ coverImg: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
	}

	async createArticle() {
		const title = $('#input-title').val().trim();
		const content = this.refs.inputContent.currentContent;
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
		const content = this.refs.inputContent.currentContent;
		const categoryId = $('#input-category').val().trim();
		const tags = this.state.tagSelected;
		if (!title || !content || categoryId == '0') {
			return $('.input-error').html('Missing required field(s)');
		}
		await this.props.dispatch(updateArticle(id, { title, content, file: this.state.file, categoryId, tags }));
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
										initialValue={this.state.content}
										init={{
											selector: 'textarea#open-source-plugins',
											plugins: 'preview paste importcss searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
											menubar: 'file edit view insert format tools table help',
											toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
											toolbar_sticky: true,
											autosave_ask_before_unload: true,
											autosave_interval: '30s',
											autosave_prefix: '{path}{query}-{id}-',
											autosave_restore_when_empty: false,
											autosave_retention: '2m',
											image_advtab: true,
											importcss_append: true,
											file_picker_callback: function (callback, value, meta) {
												var input = document.createElement('input');
												input.setAttribute('type', 'file');
												input.setAttribute('accept', 'image/*');

												/*
												  Note: In modern browsers input[type="file"] is functional without
												  even adding it to the DOM, but that might not be the case in some older
												  or quirky browsers like IE, so you might want to add it to the DOM
												  just in case, and visually hide it. And do not forget do remove it
												  once you do not need it anymore.
												*/

												input.onchange = function () {
													var file = this.files[0];

													var reader = new FileReader();
													reader.onload = function () {
														/*
														  Note: Now we need to register the blob in TinyMCEs image blob
														  registry. In the next release this part hopefully won't be
														  necessary, as we are looking to handle it internally.
														*/
														var id = 'blobid' + (new Date()).getTime();
														var blobCache = tinymce.activeEditor.editorUpload.blobCache;
														var base64 = reader.result.split(',')[1];
														var blobInfo = blobCache.create(id, file, base64);
														blobCache.add(blobInfo);

														/* call the callback and populate the Title field with the file name */
														callback(blobInfo.blobUri(), { title: file.name });
													};
													reader.readAsDataURL(file);
												};

												input.click();
											},
											template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
											template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
											height: 600,
											image_caption: true,
											quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
											noneditable_noneditable_class: 'mceNonEditable',
											toolbar_mode: 'sliding',
											contextmenu: 'link image imagetools table',
											skin: 'oxide',
											content_css: 'default',
											content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
										}}
										onChange={this.onEditorChange.bind(this)}
										ref='inputContent'
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
