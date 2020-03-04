import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LeftNavigation from '../leftNavigation/LeftNavigation';
import Dashboard from '../dasboard/Dashboard';
import FeedProcessing from '../feedProcessing/FeedProcessing';
import HealthCheck from '../healthCheck/HealthCheck';
import GlobalS3 from '../globalS3/GlobalS3';
import './Route.scss';

class MainRoute extends Component {
	render() {
		return (
			<Grid container className='right-wrapper'>
				<Grid item xs={1} className='navigation'>
					<LeftNavigation />
				</Grid>
				<Grid item xs={11} className='right-content'>
					<BrowserRouter>
						<div>
							<Route exact path='/' component={Dashboard} />
							<Route path='/feed' component={FeedProcessing} />
							<Route path='/healthcheck' component={HealthCheck} />
							<Route path='/global-s3' component={GlobalS3} />
						</div>
					</BrowserRouter>
				</Grid>
			</Grid>
		);
	}
}

export default MainRoute;
