import React, { Component } from 'react';

import { getMyProfile } from '../actions/user';

export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			avatar: '',
			file: null
		};
	}

	previewAvatar(e) {
		e.target.files && e.target.files.length > 0 &&
			this.setState({ avatar: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
	}

	async componentDidMount() {
		await this.props.dispatch(getMyProfile());
		const me = this.props.user;
		$('#input-fullname').val(me.fullName);
		$('#input-email').val(me.email);

	}

	render() {
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">My Profile</h1>
						</div>
					</div>
				</div>
				<div className="content">
					<div className="block">
						<div className="block-content">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label htmlFor="input-name">Full name *</label>
										<input type="text" className="form-control" id="input-name" />
									</div>
									<div className="form-group">
										<label>Email *</label>
										<input type="email" className="form-control" id="input-email" disabled />
									</div>
									<div className="form-group">
										<label htmlFor="input-brief">Brief *</label>
										<textarea className="form-control" id="input-brief" placeholder="Your introduction lines" rows={4} />
									</div>
									<div className="form-group">
										<label htmlFor="input-newpass">Change password</label>
										<input type="password" className="form-control" id="input-newpass" placeholder="Enter your new password" />
									</div>
									<div className="form-group">
										<label htmlFor="input-oldpass">Confirm password</label>
										<input type="password" className="form-control" id="input-oldpass" placeholder="Confirm with your current password" />
									</div>
									<div className="form-group">
										<label className="d-block" htmlFor="input-avatar">Avatar</label>
										<input type="file" id="input-avatar" accept='image/*' />
									</div>
								</div>
								<div className="col-md-6">
								</div>
								<div className="form-group col-md-6">
									<label className="d-block input-error" style={{ color: 'red' }}></label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

};
