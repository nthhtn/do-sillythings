import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Home from './Home';
import About from './About';
import ArticleDetails from './ArticleDetails';
import ArticleInCategory from './ArticleInCategory';
import SearchResult from './SearchResult';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Switch>
				<Route exact path='/about' component={About} />
				<Route exact path='/articles/category/:category' render={(props) => (<ArticleInCategory {...this.props} {...props} />)} />
				<Route exact path='/articles/search' render={(props) => (<SearchResult {...this.props} {...props} />)} />
				<Route exact path='/articles/:title' render={(props) => (<ArticleDetails {...this.props} {...props} />)} />
				<Route path='*' render={() => (<Home {...this.props} />)} />
			</Switch>
		);
	}

}

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps)(Main);
