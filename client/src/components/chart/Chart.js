import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	continer: {
		textAlign: 'center',
		marginTop: '40px'
	},
	btn: {
		backgroundColor: '#c3002f',
		marginTop: '20px'
	}
});

export default function ChartComponent(props) {
	const classes = useStyles();

	return (
		<div className={classes.continer}>
			<Doughnut
				data={props.chartDataProps && props.chartDataProps.chartData}
				width={160}
				height={100}
				options={props.chartDataProps && props.chartDataProps.options}
			/>
			<Button
				variant='contained'
				color='secondary'
				href={props.chartDataProps && props.chartDataProps.routeInfo.herf}
				className={classes.btn}>
				{props.chartDataProps && props.chartDataProps.routeInfo.cta}
			</Button>
		</div>
	);
}
