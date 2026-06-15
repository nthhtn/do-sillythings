import 'sweetalert2/dist/sweetalert2.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { getMyProfile, updateMyProfile } from '../actions/user';

export default function Profile() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);

	const [avatar, setAvatar] = useState('');
	const [file, setFile] = useState(null);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [brief, setBrief] = useState('');
	const [newpass, setNewpass] = useState('');
	const [oldpass, setOldpass] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		dispatch(getMyProfile()).then(() => {
			const { me } = user;
			if (me) {
				setFullName(me.fullName || '');
				setEmail(me.email || '');
				setBrief(me.brief || '');
				setAvatar(me.avatar || '');
			}
		});
	}, []);

	function previewAvatar(e) {
		if (e.target.files && e.target.files.length > 0) {
			setAvatar(URL.createObjectURL(e.target.files[0]));
			setFile(e.target.files[0]);
		}
	}

	async function handleUpdateProfile() {
		if (!fullName || !email || !brief) {
			return setError('Missing required field(s)');
		}
		let profile = { fullName, brief };
		if (newpass) {
			if (!oldpass) {
				return setError('You must confirm your current password to change it!');
			}
			profile = { ...profile, oldpass, newpass };
		}
		if (file) {
			profile.file = file;
		}
		setError('');
		await dispatch(updateMyProfile(profile));
		const { error: userError } = user;
		if (userError) {
			Swal.fire({
				title: userError,
				text: 'Please try again!',
				icon: 'error',
				showCancelButton: false,
				confirmButtonText: 'OK',
			});
		} else {
			Swal.fire({
				title: 'Successfully updated!',
				icon: 'success',
				showCancelButton: false,
				confirmButtonText: 'OK',
			});
		}
	}

	function backToArticleTable() {
		Swal.fire({
			text: 'Are you sure to get back?',
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
									<input type="text" className="form-control" id="input-name"
										value={fullName} onChange={(e) => setFullName(e.target.value)} />
								</div>
								<div className="form-group">
									<label>Email *</label>
									<input type="email" className="form-control" value={email} disabled />
								</div>
								<div className="form-group">
									<label htmlFor="input-brief">Brief *</label>
									<textarea className="form-control" id="input-brief" placeholder="Your introduction lines" rows={4}
										value={brief} onChange={(e) => setBrief(e.target.value)} />
								</div>
								<div className="form-group">
									<label htmlFor="input-newpass">Change password</label>
									<input type="password" className="form-control" id="input-newpass" placeholder="Enter your new password"
										value={newpass} onChange={(e) => setNewpass(e.target.value)} />
								</div>
								<div className="form-group">
									<label htmlFor="input-oldpass">Confirm current password</label>
									<input type="password" className="form-control" id="input-oldpass" placeholder="Confirm with your current password"
										value={oldpass} onChange={(e) => setOldpass(e.target.value)} />
								</div>
								<div className="form-group">
									<label className="d-block" htmlFor="input-avatar">Avatar</label>
									<input type="file" id="input-avatar" accept='image/*' onChange={previewAvatar} />
								</div>
							</div>
							<div className="col-md-6">
								{avatar && <img src={avatar} style={{ maxWidth: '100%' }} />}
							</div>
							<div className="form-group col-md-6">
								{error && <label className="d-block" style={{ color: 'red' }}>{error}</label>}
							</div>
						</div>

						<button type="button" className="btn btn-primary mr-1 mb-3" onClick={handleUpdateProfile}>
							<i className="fa fa-plus-square mr-1"></i> Submit
						</button>
						<button type="button" className="btn btn-secondary mr-1 mb-3" onClick={backToArticleTable}>
							<i className="fa fa-stop-circle mr-1"></i> Cancel
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
