import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';

import '../style/Sidebar.css';
import { listCategories } from '../actions/category';

export default function Sidebar() {
	const dispatch = useDispatch();
	const location = useLocation();
	const category = useSelector((state) => state.category);

	const query = qs.parse(location.search, { ignoreQueryPrefix: true });
	const initialCategory = query.category ? query.category.split(',') : [];

	const [selected, setSelected] = useState(initialCategory);
	const [keyword, setKeyword] = useState(query.keyword || '');

	const checklistRef = useRef(null);

	useEffect(() => {
		dispatch(listCategories()).then(() => {
			setSelected([]);
		});
	}, []);

	useEffect(() => {
		const checkList = checklistRef.current;
		if (!checkList) return;
		const anchor = checkList.getElementsByClassName('anchor')[0];
		if (!anchor) return;
		function toggleVisibility() {
			if (checkList.classList.contains('visible'))
				checkList.classList.remove('visible');
			else
				checkList.classList.add('visible');
		}
		anchor.addEventListener('click', toggleVisibility);
		return () => anchor.removeEventListener('click', toggleVisibility);
	}, [category.list]);

	function selectCategory(e) {
		const element = e.currentTarget;
		const categoryId = element.dataset.category;
		setSelected((prev) => {
			if (element.classList.contains('checked')) {
				element.classList.remove('checked');
				return prev.filter((id) => id !== categoryId);
			} else {
				element.classList.add('checked');
				return [...prev, categoryId];
			}
		});
	}

	function triggerSearch(e) {
		e.preventDefault();
		if (keyword.length < 3) return;
		const categoryIds = selected.join(',');
		window.open(
			`/articles/search?keyword=${keyword}&category=${categoryIds}`,
			'_blank'
		);
	}

	const categories = category.list || [];
	const selectedCount = selected.length;

	return (
		<div className="col-lg-4 sidebar ftco-animate fadeInUp ftco-animated">
			<div className="sidebar-box">
				<form action="#" className="search-form">
					<div className="form-group">
						<span className="icon icon-search"></span>
						<input type="text" id="search-keyword" className="form-control" placeholder="Type a keyword and hit enter"
							value={keyword} onChange={(e) => setKeyword(e.target.value)} />
					</div>
					<div className="form-group" style={{ marginTop: '10px' }}>
						<div id="category-checklist" className="dropdown-check-list" ref={checklistRef}>
							<label className="anchor">{selectedCount === 0 ? "Select category" : `${selectedCount} selected`}</label>
							<ul className="items">
								{categories.map((item) => (
									<li key={item._id} className="category-check" onClick={selectCategory} data-category={item._id}>
										{item.displayName} <i className="fas fa-check category-checkicon" aria-hidden="true"></i>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="form-group" style={{ marginTop: '10px', left: '35%' }}>
						<button className="btn btn-primary" onClick={triggerSearch}>Search</button>
					</div>
				</form>
			</div>
		</div>
	);
}
