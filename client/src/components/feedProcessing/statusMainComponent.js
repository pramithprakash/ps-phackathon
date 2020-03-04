import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import ProgressBar from './progressBar';
import StepStatus from './stepStatus';
import Filter from './filter';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TableSortLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	wrapper: {
		marginBottom: '10px'
	},
	table: {
		minWidth: 200
    },
    statusBar: {
        background: "#fff",
        color: "#333",
        height: '25px',
        textAlign: 'center'
    },
    root: {
        width: '100%',
        overflow: 'hidden'
    },
    heading: {
        fontSize: '12px',
        fontWeight: theme.typography.fontWeightRegular,
    }
}));

const StatusMainComponent = (props) => {
    const classes = useStyles();
    const [ state, setState ] = useState({
        livePercentage: '',
    });
    
    const calculateMinutes = (task) => {
        if(task.startTime) {
            const sTime = task.startTime;

            const sTimeDate = sTime.split('T')[0];
            const sTimeTime = sTime.split('T')[1];

            const taskUTCDate = sTimeDate.split('-')[2];
            const taskUTCMonth = sTimeDate.split('-')[1];
            const taskUTCYear = sTimeDate.split('-')[0];
            let taskUTCHours = sTimeTime.split(':')[0];
            let taskUTCMinutes = sTimeTime.split(':')[1];
            const taskUTCSecond = sTimeTime.split(':')[2];

            const newTaskDate = new Date(taskUTCYear, taskUTCMonth - 1, taskUTCDate, taskUTCHours, taskUTCMinutes, taskUTCSecond);

            newTaskDate.setMinutes(newTaskDate.getMinutes() + task.duration);
        
            const myUTCDate = new Date().getUTCDate();
            const myUTCMonth = new Date().getUTCMonth();
            const myUTCYear = new Date().getUTCFullYear();
            const myUTCHours = new Date().getUTCHours();
            const myUTCMinutes = new Date().getUTCMinutes();
            const myUTCSecond = new Date().getUTCSeconds();

            const myDate = new Date(myUTCYear, myUTCMonth, myUTCDate, myUTCHours, myUTCMinutes, myUTCSecond);

            const diff = Math.round(newTaskDate - myDate);
            var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes

            const percent = 100 - ((diffMins*100)/task.duration);

            if (diffMins <= 0) {
                setState({
                    livePercentage: 98
                })
                return 98;
            } else {
                setState({
                    livePercentage: (Math.floor(percent) > 98) ? 98 : Math.floor(percent)
                })
                return percent>=98 ? 98 : percent;
            }
        }
    };

    const filterFeeds = (daysOld, status, destination) => {
        return (props.filterByDays >= daysOld && (props.filterByStatus === status || props.filterByStatus === 'any') && (props.filterByDestination === destination || props.filterByDestination === 'Any'));
    };

    const capitaliseText = (text) => {
        text = (text === 'inprogress') ? "In Progress" : text;
        return text.charAt(0).toUpperCase() + text.slice(1)
    };

	if (props && props.feedFileStatus && props.feedFileStatus.length) {
		return (
			<div className="status-section">
                <Filter filterByStatus = {props.filterByStatus}
                        filterByDays = {props.filterByDays} updateFilterByStatus={props.updateFilterByStatus} updateFilterByValue={props.updateFilterByValue} 
                        updateFilterByDestination={props.updateFilterByDestination} streamDetails={props.streamDetails} />
				{props.feedFileStatus.map((task, index) => {
					return (
                    <div key={index.toString()} >
                        {filterFeeds(task.daysOld, task.status, task.destination) ? 
                        <section key={index.toString()}  className={task.status} >
                            <div className={classes.wrapper}>
                                <TableContainer component={Paper} >
                                    <Table className={classes.table} size='small' aria-label='a dense table'>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <ProgressBar updateStatusData={props.updateStatusData} task={task} calculateMinutes={calculateMinutes} />
                                                    <StepStatus
                                                        type={task.type}
                                                        source={task.source}
                                                        status={task.status}
                                                        destination={task.destination}
                                                    />

                                                    <div className={classes.root}>
                                                        <ExpansionPanel>
                                                            <ExpansionPanelSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                            >
                                                            <Typography className={classes.heading}>More Details</Typography>
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                            <TableContainer className={classes.root}>
                                                                <Table aria-label="simple table">
                                                                    <TableBody>
                                                                        <TableRow key="starttime">
                                                                        <TableCell component="th" scope="row">
                                                                            Start Time 
                                                                        </TableCell>
                                                                        <TableCell align="right">{task.startTime} </TableCell>
                                                                        </TableRow>
                                                                        <TableRow key="Market">
                                                                        <TableCell component="th" scope="row">
                                                                            Market 
                                                                        </TableCell>
                                                                        <TableCell align="right">{task.market} </TableCell>
                                                                        </TableRow>
                                                                        <TableRow key="site">
                                                                        <TableCell component="th" scope="row">
                                                                            Website 
                                                                        </TableCell>
                                                                        <TableCell align="right">{task.website} </TableCell>
                                                                        </TableRow>
                                                                        <TableRow key="progress">
                                                                        <TableCell component="th" scope="row">
                                                                            Status
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {capitaliseText(task.status)} 
                                                                            {/* {state.livePercentage && task.status ==='inprogress' ? (
                                                                                ' | ' + state.livePercentage + '% completed'
                                                                            ) : (
                                                                                ''
                                                                            )} */}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </TableBody>
                                                                </Table>
                                                                </TableContainer>
                                                            </ExpansionPanelDetails>
                                                        </ExpansionPanel>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </section>
                        : ''}

                    </div>
                    )
				})}
			</div>
		);
	} else {
		return (
			<div className={classes.wrapper}>
                
			</div>
		);
	}
};

export default StatusMainComponent;
