import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
	iconStyle: {
		fontSize: 200
	},
	cardWrapper: {
		textAlign: 'center'
	},
	wrapper: {
		marginTop: '10px'
	},
	heading: {
		textTransform: 'uppercase',
		textAlign: 'left'
	}
});

const DashboardCard = (props) => {
	const classes = useStyles();

	return (
		<div>
			<Grid container spacing={3} className={classes.wrapper}>
				{props.dashboardInfo &&
					props.dashboardInfo.details.map((dashboard, index) => (
						<Grid item xs={6} key={index}>
							<Card className={classes.root}>
								<CardActionArea className={classes.cardWrapper}>
									<CardContent>
										<Typography
											gutterBottom
											className={classes.heading}
											variant='h5'
											component='h2'>
											{dashboard.title}
										</Typography>
										<Typography variant='body2' color='textSecondary' component='p'>
											{dashboard.value}
										</Typography>
									</CardContent>
								</CardActionArea>
								<CardActions>
									<Button size='small' color='primary' href={dashboard.href}>
										{dashboard.cta}
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
			</Grid>
		</div>
	);
};

export default DashboardCard;
