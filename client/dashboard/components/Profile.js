import 'sweetalert2/dist/sweetalert2.css';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';

import { getMyProfile, updateMyProfile } from '../actions/user';

export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			avatar: '',
			file: null,
			done: false
		};
	}

	previewAvatar(e) {
		e.target.files && e.target.files.length > 0 &&
			this.setState({ avatar: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
	}

	async componentDidMount() {
		await this.props.dispatch(getMyProfile());
		const { me } = this.props.user;
		console.log(me);
		$('#input-name').val(me.fullName);
		$('#input-email').val(me.email);
		$('#input-brief').val(me.brief);
		this.setState({ avatar: me.avatar });
	}

	async updateMyProfile() {
		const fullName = $('#input-name').val();
		const email = $('#input-email').val();
		const brief = $('#input-brief').val();
		if (!fullName || !email || !brief) {
			return $('.input-error').html('Missing required field(s)');
		}
		let profile = { fullName, brief };
		const newpass = $('#input-newpass').val();
		const oldpass = $('#input-oldpass').val();
		if (!!newpass) {
			if (!oldpass) {
				return $('.input-error').html('You must confirm your current password to change it!');
			}
			profile = { ...profile, oldpass, newpass };
		}
		if (this.state.file) {
			profile.file = this.state.file;
		}
		$('.input-error').html('');
		console.log(profile);
		await this.props.dispatch(updateMyProfile(profile));
		const { error } = this.props.user;
		if (error) {
			Swal.fire({
				title: error,
				text: 'Please try again!',
				icon: 'error',
				showCancelButton: false,
				confirmButtonText: 'OK',
			});
		}
		else {
			Swal.fire({
				title: 'Successfully updated!',
				icon: 'success',
				showCancelButton: false,
				confirmButtonText: 'OK',
			});
		}
	}

	backToArticleTable() {
		Swal.fire({
			text: 'Are you sure to get back?',
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

	render() {
		if (this.state.done) {
			return <Redirect to='/dashboard/articles' />
		}
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
										<label htmlFor="input-oldpass">Confirm current password</label>
										<input type="password" className="form-control" id="input-oldpass" placeholder="Confirm with your current password" />
									</div>
									<div className="form-group">
										<label className="d-block" htmlFor="input-avatar">Avatar</label>
										<input type="file" id="input-avatar" accept='image/*' onChange={this.previewAvatar.bind(this)} />
									</div>
								</div>
								<div className="col-md-6">
									{this.state.avatar && <img src={this.state.avatar} style={{ maxWidth: '100%' }} />}
								</div>
								<div className="form-group col-md-6">
									<label className="d-block input-error" style={{ color: 'red' }}></label>
								</div>
							</div>

							<button type="button" className="btn btn-primary mr-1 mb-3" onClick={this.updateMyProfile.bind(this)}>
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

};
