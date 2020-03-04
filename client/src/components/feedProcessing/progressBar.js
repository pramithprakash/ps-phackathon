import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	root: {
        width: '100%',
        position: 'relative',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
    },
    progressBar: {
        height: '104px',
        position: 'absolute',
        width: 'calc(100% + 2px)',
        opacity: '0.2',
        zIndex: 0
    }
}));

export default function LinearBuffer(props) {
    const classes = useStyles();

    const [ state, setState ] = useState({
        completed: (props && props.task && props.task.status === 'done') ? 100 : 0,
        buffer: (props && props.task && props.task.status === 'done') ? 100 : 0,
        statusColor: (props && props.task && props.task.status === 'done') ? 'primary' : 'secondary'
	});
    
    const [ completed, setCompleted ] = React.useState((props && props.task && props.task.status === 'done') ? 100 : 0);
    const [ buffer, setBuffer ] = React.useState((props && props.task && props.task.status === 'done') ? 100 : 0);


    const processFileCall = async (updateStatusData, props, retryDuration) => {
        let result = null;

        try {
            result = await axios.get(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/fileStatus/${props.uuid}`);
        } catch (err) {
            const error = {
                "source": props.source,
                "destination": props.destination,
                "status": "error",
                "type": props.destination,
                "uuid": props.uuid
            };
            progress.current(props, true);
            updateStatusData(error);

        } finally {
            if (result && result.data && result.data.uuid && result.data.status !== 'inprogress' ) {
                updateStatusData(result.data);
                progress.current(props, true);
            } else if(result && result.data && result.data.uuid && result.data.status === 'inprogress') {
                setTimeout(function(){
                    console.log(1)
                    processFileCall(updateStatusData, props, retryDuration);

                },(parseInt(retryDuration)) * 1000 * 60 ); //converting to mileseconds
            }
        }
    };

    const progress = React.useRef(() => {});
    React.useEffect(() => {
        console.log(1)
        progress.current = (props, statusDone) => {
            if (statusDone) {
                setCompleted(100);
                setBuffer(100);
                
                setState(prevState => {
                    return {
                        completed: 100,
                        buffer: 100,
                        statusColor: "primary"
                    };
                });
            }
            else if (props && props.task && props.task.status !== 'done' && props.task.status !== 'error') {
                const diff = Math.random() * 10;
                const retryDuration = 5;// in minutes
                setCompleted(props.calculateMinutes(props.task));
                setBuffer(props.calculateMinutes(props.task) + diff);

                setState(prevState => {
                    return {
                        completed: props.calculateMinutes(props.task),
                        buffer: props.calculateMinutes(props.task) + diff,
                        statusColor: "secondary"
                    };
                });

                if (props.calculateMinutes(props.task) >= 98) {
                    processFileCall(props.updateStatusData, props.task, retryDuration);
                    clearInterval(timer);
                }
            } else {
                clearInterval(timer);
            }
        };

		function tick() {
			progress.current(props);
		}
		const timer = setInterval(tick, 1000);

        return () => {
			clearInterval(timer);
        };
        
	},[]);

	return (
		<div className={classes.root}>
			<LinearProgress className={classes.progressBar} variant='buffer' value={state && state.completed} valueBuffer={state && state.buffer} color={state.statusColor} />
		</div>
	);
}
