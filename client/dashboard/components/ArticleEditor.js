import 'sweetalert2/dist/sweetalert2.css';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Typeahead, TypeaheadMenu } from 'react-bootstrap-typeahead';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { createArticle, updateArticle, getArticle } from '../actions/article';
import { listCategories } from '../actions/category';
import Loader from './Loader';

function generateObjectId() {
	const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
	let random = '';
	for (let i = 0; i < 16; i++) { random += Math.floor(Math.random() * 16).toString(16); }
	return timestamp + random;
}

export default function ArticleEditor() {
	const { id } = useParams();
	const articleId = id && id !== 'new' ? id : null;
	const isNew = articleId == null;
	const [newArticleId] = useState(() => (isNew ? generateObjectId() : null));
	const uploadArticleId = isNew ? newArticleId : articleId;

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const article = useSelector((state) => state.article);
	const category = useSelector((state) => state.category);

	const editorRef = useRef(null);
	const tagRef = useRef(null);

	const [title, setTitle] = useState('');
	const [categoryId, setCategoryId] = useState('0');
	const [coverImg, setCoverImg] = useState('');
	const [file, setFile] = useState(null);
	const [tagOptions, setTagOptions] = useState([]);
	const [tagSelected, setTagSelected] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [editorLoading, setEditorLoading] = useState(true);
	const [coverLoading, setCoverLoading] = useState(true);

	useEffect(() => {
		dispatch(listCategories()).then(() => {
			if (!isNew) {
				dispatch(getArticle(articleId)).then((result) => {
					// Read the article straight off the resolved dispatch, not the
					// `article` selector closed over at mount — that value is a stale
					// snapshot from before this fetch started, and using it here caused
					// a previously-viewed article's data (esp. coverImg) to leak into
					// this one whenever its own fetch resolved after this closure formed.
					const current = result.article;
					if (current) {
						setTitle(current.title || '');
						setCategoryId(current.categoryId || '0');
						setCoverImg(current.coverImg || '');
						setCoverLoading(!!current.coverImg);
						setTagOptions(current.tags || []);
						setTagSelected(current.tags || []);
					} else {
						setCoverLoading(false);
					}
					setLoading(false);
				});
			} else {
				setCoverLoading(false);
				setLoading(false);
			}
		});
	}, []);

	function previewCoverImg(e) {
		if (e.target.files && e.target.files.length > 0) {
			setCoverLoading(true);
			setCoverImg(URL.createObjectURL(e.target.files[0]));
			setFile(e.target.files[0]);
		}
	}

	async function handleCreate() {
		const content = editorRef.current ? editorRef.current.getContent() : '';
		if (!title || !content || !file || categoryId === '0') {
			return setError('Missing required field(s)');
		}
		setError('');
		await dispatch(createArticle({ _id: newArticleId, title, content, file, categoryId, tags: tagSelected }));
		if (tagRef.current) tagRef.current.clear();
		navigate('/dashboard/articles');
	}

	async function handleUpdate() {
		const content = editorRef.current ? editorRef.current.getContent() : '';
		if (!title || !content || categoryId === '0') {
			return setError('Missing required field(s)');
		}
		setError('');
		await dispatch(updateArticle(articleId, { title, content, file, categoryId, tags: tagSelected }));
		navigate('/dashboard/articles');
	}

	function backToArticleTable() {
		Swal.fire({
			text: 'Are you sure to come back to table view?',
			title: 'You will lose all your changes!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				navigate('/dashboard/articles');
			}
		});
	}

	function onTagChange(selected) {
		setTagOptions(selected);
		setTagSelected(selected);
	}

	function onTagInputChange(string) {
		if (string.indexOf(',') >= 0) {
			const newtag = { _id: '', tagValue: string.split(',')[0].trim() };
			if (tagRef.current) tagRef.current.clear();
			setTagOptions((prev) => [...prev, newtag]);
			setTagSelected((prev) => [...prev, newtag]);
		}
	}

	const listCats = category?.list || [];

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
						{loading ? <Loader /> : (<>
						{(editorLoading || coverLoading) && <Loader />}
						<div style={(editorLoading || coverLoading) ? { display: 'none' } : undefined}>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label htmlFor="input-title">Blog title *</label>
									<input type="text" className="form-control" id="input-title" placeholder="Title"
										value={title} onChange={(e) => setTitle(e.target.value)} />
								</div>
								<Editor
									apiKey={process.env.TINYMCE_APIKEY}
									initialValue={article.current?.content || ''}
									onInit={(_, editor) => { editorRef.current = editor; setEditorLoading(false); }}
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
										images_upload_handler: (blobInfo) => new Promise((resolve, reject) => {
											const formdata = new FormData();
											formdata.append('file', blobInfo.blob(), blobInfo.filename());
											formdata.append('article_id', uploadArticleId);
											fetch('/api/articles/upload-image', {
												method: 'POST',
												credentials: 'same-origin',
												body: formdata
											})
												.then((res) => res.json())
												.then((json) => json.success ? resolve(json.url) : reject(json.error))
												.catch((err) => reject(String(err)));
										}),
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
								/>
								<div className="row">
									<div className="form-group col-md-12">
										<label htmlFor="input-tag">Tags (delimited by ,)</label>
										<Typeahead
											options={tagOptions}
											selected={tagSelected}
											id="input-tag"
											multiple
											labelKey="tagValue"
											ref={tagRef}
											onChange={onTagChange}
											onInputChange={onTagInputChange}
											renderMenu={(results, menuProps) => {
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
										<select className="custom-select" id="input-category"
											value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
											<option value="0">Please select</option>
											{listCats.map((cat) =>
												(<option key={cat._id} value={cat._id}>{cat.displayName}</option>))
											}
										</select>
									</div>
									<div className="form-group col-md-6">
										<label className="d-block" htmlFor="input-image">Cover image *</label>
										<input type="file" id="input-image" accept='image/*' onChange={previewCoverImg} />
									</div>
								</div>
							</div>
							<div className="col-md-6">
								{coverImg && <img src={coverImg} style={{ maxWidth: '100%' }}
								onLoad={() => setCoverLoading(false)} onError={() => setCoverLoading(false)} />}
							</div>
							<div className="form-group col-md-6">
								{error && <label className="d-block" style={{ color: 'red' }}>{error}</label>}
							</div>
						</div>

						<button type="button" className="btn btn-primary mr-1 mb-3"
							onClick={isNew ? handleCreate : handleUpdate}>
							<i className="fa fa-plus-square mr-1"></i> Submit
						</button>
						<button type="button" className="btn btn-secondary mr-1 mb-3" onClick={backToArticleTable}>
							<i className="fa fa-stop-circle mr-1"></i> Cancel
						</button>
						</div>
						</>)}
					</div>
				</div>
			</div>
		</main>
	);
}
