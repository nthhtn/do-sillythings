import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';

import Main from './components/Main';
import store from './store';

const rootComponent = (
	<Provider store={store}>
		<BrowserRouter>
			<div id="page-container" className="sidebar-o sidebar-dark enable-page-overlay side-scroll page-header-fixed side-trans-enabled">
				<nav id="sidebar">
					<div className="simplebar-scroll-content" style={{ paddingRight: '15px', marginBottom: '-30px' }}>
						<div className="simplebar-content" style={{ paddingBottom: '15px', marginRight: '-15px' }}>
							<div className="content-header bg-white-5">
								<a className="font-w600 text-dual" href="/dashboard">
									<i className="fa fa-circle-notch text-primary"></i>
									<span className="smini-hide">
										<span className="font-w700 font-size-h5">ne</span> <span className="font-w400">4.2</span>
									</span>
								</a>
								<a className="d-lg-none text-dual ml-3" data-toggle="layout" data-action="sidebar_close" href={undefined} onClick={(e) => e.preventDefault()}>
									<i className="fa fa-times"></i>
								</a>
							</div>
							<div className="content-side content-side-full">
								<ul className="nav-main">
									<li className="nav-main-item">
										<Link className="nav-main-link active" to="/dashboard">
											<i className="nav-main-link-icon si si-speedometer"></i>
											<span className="nav-main-link-name">Dashboard</span>
										</Link>
									</li>
									<li className="nav-main-item">
										<Link className="nav-main-link active" to="/dashboard/articles">
											<i className="nav-main-link-icon si si-docs"></i>
											<span className="nav-main-link-name">Articles</span>
										</Link>
									</li>
									{/* <li className="nav-main-item">
										<Link className="nav-main-link active" to="/dashboard/about">
											<i className="nav-main-link-icon si si-list"></i>
											<span className="nav-main-link-name">Categories</span>
										</Link>
									</li> 
									<li className="nav-main-item">
										<Link className="nav-main-link active" to="/dashboard/about">
											<i className="nav-main-link-icon si si-heart"></i>
											<span className="nav-main-link-name">About</span>
										</Link>
									</li>*/}
									<li className="nav-main-item">
										<Link className="nav-main-link active" to="/dashboard/profile">
											<i className="nav-main-link-icon si si-user"></i>
											<span className="nav-main-link-name">Profile</span>
										</Link>
									</li>
									<li className="nav-main-item">
										<a className="nav-main-link active" href="/">
											<i className="nav-main-link-icon si si-home"></i>
											<span className="nav-main-link-name">Home</span>
										</a>
									</li>
									<li className="nav-main-item">
										<a className="nav-main-link active" href="/logout">
											<i className="nav-main-link-icon si si-logout"></i>
											<span className="nav-main-link-name">Logout</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
				<header id="page-header">
				</header>
				<Main />
			</div>
		</BrowserRouter>
	</Provider>
);

render(rootComponent, document.getElementById('root'));
