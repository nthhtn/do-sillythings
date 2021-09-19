import React, { Component } from 'react';

export default class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<main id="main-container">
				<div className="bg-body-light">
					<div className="content content-full">
						<div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-sm-center">
							<h1 className="flex-sm-fill h3 my-2">Welcome to dashboard</h1>
						</div>
					</div>
				</div>
				<div className="content"></div>
			</main>
		);
	}

}
