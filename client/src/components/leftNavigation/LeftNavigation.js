import React from 'react';
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import './LeftNavigation.scss';

import Navigation from './Navigation';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles({
	continer: {
		padding: '0',
        minHeight: '100%',
        background: '#f8f8fc'
	},
	title: {
		color: '#000',
		paddingBottom: '25px',
        textTransform: 'uppercase',
        fontSize: 14,
        textAlign: 'center'
	},
	img: {
		width: '94px',
		height: '89px'
	}
});

export default function NavigationDrawers() {
	const classes = useStyles();

	return (
		<div className={classes.continer}>
			<ThemeProvider theme={theme}>
				<img src='/static/images/nissan-logo' alt='Nissan' className={classes.img} />
				<Typography variant='h6' className={classes.title}>
					{/* Nissan */}
				</Typography>
				<Navigation />
			</ThemeProvider>
		</div>
	);
}
