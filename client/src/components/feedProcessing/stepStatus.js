import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import './FeedProcessing.scss';

const useStyles = makeStyles((theme) => ({
	root: {
        width: '100%',
        zIndex: 1,
        position: 'relative'
    },
    title: {
        padding: '12px 18px 0',
        fontWeight: 'bold'
    },
    paper: {
        background: 'none'
    }
}));

const StepStatus = (props) => {
    const classes = useStyles();
    const capitaliseText = (text) => {
        text = (text === 'inprogress') ? "In Progress" : text;
        return text.charAt(0).toUpperCase() + text.slice(1)
    };

    const QontoStepIcon = (props) => {
        const { active, completed } = props;
        return (
        <div>
            {(props.status === 'done') ? <CheckCircleOutlineIcon /> : (props.status === 'inprogress') ? <AccessTimeIcon /> : <ErrorOutlineIcon />}
        </div>
        );
    }

    const statusBar = () => {
        return QontoStepIcon(props);
    }

    const arrowIcon = () => {
        return <ArrowRightIcon />;
    }

	return (
		<div className={classes.root}>
            <div className={classes.title}>{capitaliseText(props.type)}</div>
			<Stepper className={classes.paper}>
                <Step>
                    <StepLabel  StepIconComponent={arrowIcon}>{capitaliseText(props.source)}</StepLabel>
                </Step>
                <Step>
                    <StepLabel StepIconComponent={statusBar}>{capitaliseText(props.status)}</StepLabel>
                </Step>
                <Step>
                    <StepLabel StepIconComponent={arrowIcon}>{capitaliseText(props.destination)}</StepLabel>
                </Step>
			</Stepper>
		</div>
	);
}

export default StepStatus;