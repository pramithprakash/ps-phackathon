import React from 'react';
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles({
	title: {
		padding: '20px',
		textTransform: 'uppercase'
	},
	wrapper: {
		marginTop: '35px'
	}
});

export default function GlobalS3() {
	const classes = useStyles();

	return (
		<div className={classes.wrapper}>
			<ThemeProvider theme={theme}>
				<Typography variant='h4' className={classes.title}>
					Global S3
				</Typography>
			</ThemeProvider>
		</div>
	);
}
