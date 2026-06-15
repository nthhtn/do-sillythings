import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

import Main from './components/Main';
import store from './store';
import { getMyProfile } from './actions/user';

function Login() {
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const [loginError, setLoginError] = useState('');

	function handleLogin() {
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;
		if (!username || !password) {
			setLoginError('Invalid username/password');
			return;
		}
		axios.post('/login', { username, password })
			.then(() => {
				window.location.href = '/';
			})
			.catch((error) => {
				setLoginError(error.response.data.error);
			});
	}

	return (
		<div className="modal fade" id="modal-login" tabIndex={-1} role="dialog" aria-labelledby="modal-loginLabel" aria-hidden="true">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="modal-loginLabel">Login</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div className="modal-body">
						<div className="form-group">
							<input type="text"
								className="form-control form-control-alt form-control-lg"
								ref={usernameRef}
								placeholder="Username" />
						</div>
						<div className="form-group">
							<input type="password"
								className="form-control form-control-alt form-control-lg"
								ref={passwordRef}
								placeholder="Password" />
						</div>
						<div className="form-group">
							{loginError && <label className="d-block" style={{ color: 'red' }}>{loginError}</label>}
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
					</div>
				</div>
			</div>
		</div>
	);
}

store.dispatch(getMyProfile())
	.then(() => {
		const rootComponent = (
			<Provider store={store}>
				<BrowserRouter>
					<nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
						<div className="container">
							<a className="navbar-brand" href="/">Silly things</a>
							<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
								aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
								<span className="oi oi-menu"></span> Menu</button>
							<div className="collapse navbar-collapse" id="ftco-nav">
								<ul className="navbar-nav ml-auto">
								<li className="nav-item"><a href="/wedding" className="nav-link">Wedding</a></li>
									<li className="nav-item"><a href="/" className="nav-link">Home</a></li>
									<li className="nav-item dropdown">
										<a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Our diary</a>
										<div className="dropdown-menu" aria-labelledby="dropdown04">
											<a className="dropdown-item" href="/articles/category/Silly things">Silly things</a>
											<a className="dropdown-item" href="/articles/category/Silly love">Silly love</a>
											<a className="dropdown-item" href="/articles/category/Silly trips">Silly trips</a>
										</div>
									</li>
									<li className="nav-item dropdown">
										<a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Self story</a>
										<div className="dropdown-menu" aria-labelledby="dropdown04">
											<a className="dropdown-item" href="/articles/category/Silly gf">Silly gf</a>
											<a className="dropdown-item" href="/articles/category/Silly bf">Silly bf</a>
										</div>
									</li>
									<li className="nav-item"><a href="/about" className="nav-link">About Us</a></li>
									{
										store.getState().user.me &&
										(<li className="nav-item"><a href="/dashboard" className="nav-link">Dashboard</a></li>)
									}
								</ul>
							</div>
							{
								!store.getState().user.me ?
									(<button className="btn btn-primary py-3 px-5" data-toggle="modal" data-target="#modal-login">
										<i className="fas fa-sign-in-alt"></i> Login
									</button>)
									: (<a href='/logout'><button className="btn btn-primary py-3 px-5">
										<i className="fas fa-sign-out-alt"></i> Logout
									</button></a>)
							}
						</div>
					</nav>
					{
						!store.getState().user.me &&
						(<Login />)
					}
					<div className="hero-wrap js-fullheight" style={{ backgroundImage: 'url("/assets/img/cover.JPG")', height: '962px' }} id="cover-wrapper">
						<div className="overlay"></div>
						<div className="container">
							<div className="row no-gutters slider-text js-fullheight align-items-center justify-content-center" data-scrollax-parent="true"
								style={{ height: '962px' }}>
								<div className="col-md-9 ftco-animate text-center" data-scrollax="properties: { translateY: '70%' }">
									<h1 className="mb-4" data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">Two silly persons</h1>
									<p data-scrollax="properties: { translateY: '30%', opacity: 1.6 }">Some silly things, many silly moments, with one silly love</p>
								</div>
							</div>
						</div>
					</div>
					<Main />
					<footer className="ftco-footer ftco-bg-dark ftco-section">
						<div className="container">
							<div className="row">
								<div className="col-md-12 text-center">
									<p>Copyright &copy; All rights reserved | This template is made with <i className="icon-heart" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a></p>
								</div>
							</div>
						</div>
					</footer>
				</BrowserRouter>
			</Provider>
		);
		createRoot(document.getElementById('root')).render(rootComponent);
		const script = document.createElement("script");
		script.src = "/assets/explore/js/main.js";
		script.async = true;
		document.body.appendChild(script);
	});
