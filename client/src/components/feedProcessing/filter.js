import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FeildSets from './feildSets';

const useStyles = makeStyles((theme) => ({
	root: {
        borderBottom: '1px dotted #333',
        padding: '0 10px',
        zIndex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        alignContent: 'stretch',
        marginBottom: '30px'
    },
    filterSelect: {
        width: '120px',
        marginRight: '30px'
    },
    filterLabel: {
        paddingRight: '24px',
        paddingBottom: '6px'
    }
}));

const Filter = (props) => {
    const classes = useStyles();

    const filterByDaysSwitch = () => {
        switch(props.filterByDays) {
            case 0:
                return 'Today';
                case 7:
                    return 'This Week';
                    case 30:
                        return 'This Month';
                        default:
                            return 'All Data';
        }
    };

    const [ state, setState ] = useState({
        defaultFilterByDays: filterByDaysSwitch(),
        defaultFilterByStatus: 'any',
        defaultFilterDestination: 'Any'
    });
    
    

	const handleChange = (event) => {
        switch(event.target.value) {
            case 'Today':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: 'Today',
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: prevState.defaultFilterByStatus
                    }
                });
                props.updateFilterByValue(0);
                return false;
            case 'This Week':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: 'This Week',
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: prevState.defaultFilterByStatus
                    }
                });
                props.updateFilterByValue(7);
                return false;
            case 'This Month':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: 'This Month',
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: prevState.defaultFilterByStatus
                    }
                });
                props.updateFilterByValue(30);
                return false;
            default:
                setState(prevState => {
                    return { 
                        defaultFilterByDays: 'All Data',
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: prevState.defaultFilterByStatus
                    }
                });
                props.updateFilterByValue(100);
                return false;
        }
    };

    const handleChangeDestination = (event) => {
        setState(prevState => {
            return { 
                defaultFilterByDays: prevState.defaultFilterByDays,
                defaultFilterDestination: event.target.value,
                defaultFilterByStatus: prevState.defaultFilterByStatus
            }
        });
        props.updateFilterByDestination(event.target.value);
    };

    const handleChangeStatus = (event) => {
        switch(event.target.value) {
            case 'Any':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: prevState.defaultFilterByDays,
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: 'any'
                    }
                });
                props.updateFilterByStatus('any');
                return false;
            case 'Success':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: prevState.defaultFilterByDays,
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: 'done'
                    }
                });
                props.updateFilterByStatus('done');
                return false;
            case 'In Progress':
                setState(prevState => {
                    return { 
                        defaultFilterByDays: prevState.defaultFilterByDays,
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: 'inprogress'
                    }
                });
                props.updateFilterByStatus('inprogress');
                return false;
            default:
                setState(prevState => {
                    return { 
                        defaultFilterByDays: prevState.defaultFilterByDays,
                        defaultFilterDestination: prevState.defaultFilterDestination,
                        defaultFilterByStatus: 'error'
                    }
                });
                props.updateFilterByStatus('error');
                return false;
        }
    };

    const mapDefaultValue = (defaultFilterByStatus) => {
        switch(defaultFilterByStatus) {
            case 'any':
                return 'Any';
            case 'done':
                return 'Success';
            case 'inprogress':
                return 'In Progress';
            default:
                return 'Error';
        }
    };

	return (
		<div className={classes.root}>
            <div className={classes.filterLabel}>FILTER BY:</div>
            <div className={classes.filterSelect}>
            <FeildSets
                dropDowndataInfo={['Today', 'This Week', 'This Month', 'All Data']}
                name='filter'
                title = 'Start Date'
                defaultValue={state && state.defaultFilterByDays}
                onChange={handleChange}
				/>
            </div>
            <div className={classes.filterSelect}>
            <FeildSets
                className={classes.filterSelect}
                dropDowndataInfo={['Any', 'Success', 'In Progress', 'Error']}
                name='filter'
                title= 'Status'
                onChange={handleChangeStatus}
                defaultValue={mapDefaultValue(state && state.defaultFilterByStatus)}
				/>
            </div>
            <div className={classes.filterSelect}>
            <FeildSets
                className={classes.filterSelect}
                dropDowndataInfo={props.streamDetails}
                name='filter'
                title= 'Destination'
                onChange={handleChangeDestination}
                defaultValue={state && state.defaultFilterDestination}
				/>
            </div>
		</div>
	);
}

export default Filter;