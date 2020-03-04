import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import StreamSelection from './streamSelection';
import StatusMainComponent from './statusMainComponent';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles({
	title: {
        paddingTop: '15px',
        paddingBottom: '20px',
        textTransform: 'uppercase',
        fontSize: '30px'
	},
	wrapper: {
        margin: '0 auto',
        maxWidth: '90%',
        background: '#fff',
        paddingTop: '30px',
        paddingLeft: '35px'
    }
});

export default function FeedProcessing() {
    const classes = useStyles();
    
    const [ state, setState ] = useState({
        feedFileData: {},
        filterByDays: 0,
        filterByStatus: 'any',
        filterByDestination: 'Any',
        error : false,
        addError: false,
        addedMsg: false,
        healthError: false
	});

	useEffect(() => {
		const fetchData = async () => {
            let result = null;

            try {
                result = await axios.get(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/environmentDetails`);
            } catch (err) {
                setState({ feedFileData: {}, error: true });
            } finally {
                if (result && result.data) {
                    result.data.feedFileSelections.brand = ['nissan', 'Infiniti']
                    setState({ feedFileData: filteredDataKey(result.data), error: false, filterByDays: parseInt(getDefaultDay(result.data)), filterByStatus: 'any', filterByDestination: 'Any', addError: false, addedMsg: false, healthError: false  });
                } else {
                    setState({ feedFileData: {}, error: true, filterByDays: 0, filterByStatus:'any', filterByDestination: 'Any', addError: false, addedMsg: false, healthError: false  });
                }
            }
		};

		fetchData();
    }, []);

    const getDefaultDay = (data) => {
        let differenceInDays;
        let min = 0;
        let done = false;
        data.feedFileStatus.map((item, index) => {
            if (item && item.startTime ) {
                const startDate = new Date(item.startTime);
                const currentDate = new Date();
                const differenceInTime = currentDate.getTime() - startDate.getTime()
                differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
            }

            if(min <= differenceInDays && !done) {
                min = differenceInDays;
                done = true
            }
        });

        if (min === 0) {
            return '0';
        } else if (min <= 7) {
            return '7'
        } else  if (min <= 30){
            return '30'
        } else {
            return '100'
        }
    };

    const filteredDataKey = (data, newItem) => {
        if (data && newItem) {
            if (data.startTime ) {
                const startDate = new Date(data.startTime);
                const currentDate = new Date();
                const differenceInTime = currentDate.getTime() - startDate.getTime()
                const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 

                return differenceInDays;
            }
        } else if (!newItem && data && !data.feedFileStatus || !data.feedFileStatus.length) {
            return data;
        }

        data.feedFileStatus.map((item, index) => {
            if (item && item.startTime ) {
                const startDate = new Date(item.startTime);
                const currentDate = new Date();
                const differenceInTime = currentDate.getTime() - startDate.getTime()
                const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 

                item.daysOld = differenceInDays;
            }
        });
        return data
    };

    const processFileCall = async (newData) => {
        let result = null;

        const params = {
            "source": newData.source,
            "destination": newData.destination,
            "type": newData.type,
            "website": newData.website,
            "market": newData.market.split('_')[1],
            "locale": newData.market.split('_')[0],
            "brand": newData.brand
        }

        setState(prevState => {
            return { feedFileData:prevState.feedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false, addedMsg: false};
        });

        try {
            result = await axios.post(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/createFeedfile `, params);
        } catch (err) {
            setState(prevState => {
                const newFeedFileData = Object.assign({}, prevState.feedFileData);
 
                return { feedFileData:newFeedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: true, addedMsg: false };
            });

        } finally {
            if (result && result.data && result.data.uuid) {
                setState(prevState => {
                    const newFeedFileData = Object.assign({}, prevState.feedFileData);
                    const newFeed = {
                            "source": result.data.source,
                            "destination": result.data.destination,
                            "status": "inprogress",
                            "type": result.data.type,
                            "website": result.data.website,
                            "duration": result.data.duration,
                            "startTime": result.data.startTime,
                            "uuid": result.data.uuid,
                            "daysOld": filteredDataKey(result.data, true)
                        }
                    newFeedFileData.feedFileStatus.unshift(newFeed);
                    return { feedFileData:newFeedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false, addedMsg: true  };
                });
            }
        }
    };

    const capitaliseText = (text) => {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
    };


    const updateFilterByValue = (value) => {
        setState(prevState => {
            const newFeedFileData = Object.assign({}, prevState.feedFileData);

            return { feedFileData:newFeedFileData, error: false, filterByDays: value, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false ,addedMsg: false, healthError: false };
        });
    }

    const updateFilterByStatus = (value) => {
        setState(prevState => {
            const newFeedFileData = Object.assign({}, prevState.feedFileData);

            return { feedFileData:newFeedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: value, filterByDestination: prevState.filterByDestination, addError: false,addedMsg: false, healthError: false  };
        });
    }

    const updateFilterByDestination = (value) => {
        setState(prevState => {
            const newFeedFileData = Object.assign({}, prevState.feedFileData);

            return { feedFileData:newFeedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: value, addError: false,addedMsg: false, healthError: false  };
        });
    }

    const updateState = (newData) => {
        if (newData) {
            processFileCall(newData)
        }
    }

    const updateStatusData = (statusData) => {
        if (statusData && statusData.uuid) {
            setState(prevState => {
                const newFeedFileData = Object.assign({}, prevState.feedFileData);

                newFeedFileData.feedFileStatus.map((item, index) => {
                    if (item && item.uuid === statusData.uuid) {
                        item.status = statusData.status;
                    }
                });

                return { feedFileData:newFeedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false,addedMsg: false, healthError: false  };
            });
        } 
    };

    const streamDetailsUpdate = (data) => {
        if (data && data[0] !== 'Any') {
            data.splice(0, 0, 'Any');
        }

        return data
    };

    const handleClose = () => {
        setState((prevState) => {
            return { feedFileData:prevState.feedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false,addedMsg: false, healthError: false };
        });
    };

    const updateErrorStatus = () => {
        setState((prevState) => {
            return { feedFileData: prevState.feedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false,addedMsg: false, healthError: false };
        });
    };

    const healthCheckStatus = (data) => {

        setState((prevState) => {
            return { feedFileData: prevState.feedFileData, error: false, filterByDays: prevState.filterByDays, filterByStatus: prevState.filterByStatus, filterByDestination: prevState.filterByDestination, addError: false,addedMsg: false, healthError: true, healthErrorData: data };
        });
    };

	return (
		<div className={classes.wrapper}>
			<ThemeProvider theme={theme}>
				<Typography variant='h4' className={classes.title}>
					Feed file processing
				</Typography>
			</ThemeProvider>

            <div>
                {state.error ? (
                    <Snackbar open={true}>
                         <MuiAlert elevation={6} variant="filled" severity="error" >
                            Unable to load the data - Network Error
                        </MuiAlert>
                    </Snackbar>
                ) : (
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <StreamSelection updateErrorStatus={updateErrorStatus} updateState={updateState} feedFileSelections={state.feedFileData && state.feedFileData.feedFileSelections} feedFileStatus={state.feedFileData && state.feedFileData.feedFileStatus} healthCheckStatus={healthCheckStatus}
                            />
                        </Grid>
                        <Grid item xs={7}>
                            <StatusMainComponent streamDetails={streamDetailsUpdate(state.feedFileData && state.feedFileData.feedFileSelections && state.feedFileData.feedFileSelections.destinationEnvironment)} updateFilterByValue={updateFilterByValue} filterByDays={state.filterByDays} updateStatusData={updateStatusData} updateFilterByStatus={updateFilterByStatus} updateFilterByDestination={updateFilterByDestination} feedFileStatus={state.feedFileData && state.feedFileData.feedFileStatus}
                            filterByStatus = {state && state.filterByStatus}
                            filterByDays = {state && state.filterByDays}
                            filterByDestination = {state && state.filterByDestination}
                            />
                        </Grid>

                        <Snackbar open={state.addError} onClose={handleClose}  autoHideDuration={2000}>
                            <MuiAlert elevation={6} onClose={handleClose}  variant="filled" severity="error" >
                                Feed File Processing Failed - Network Error
                            </MuiAlert>
                        </Snackbar>

                        <Snackbar open={state.addedMsg} onClose={handleClose}  autoHideDuration={2000}>
                            <MuiAlert elevation={6} onClose={handleClose}   variant="filled" severity="success" >
                                Feed File Processing successfully started
                            </MuiAlert>
                        </Snackbar>

                        <Snackbar className="error-message" open={state.healthError} onClose={handleClose} >
                            <MuiAlert elevation={6} onClose={handleClose}   variant="filled" severity="error" >
                                Health Check failed for the selected Stream, Connectivity Failure in-
                                <ul>
                                    {state.healthErrorData && state.healthErrorData.errorList.map((error, index) => {
                                        return (
                                        <li>{capitaliseText(error)}</li>
                                        )
                                    })}
                                </ul>
                                A Jira ticket is logged for this incident,
                                 <a target="_blank" href={state.healthErrorData && state.healthErrorData.jiraUrl}> please click here for more details</a>
                            </MuiAlert>
                        </Snackbar>
                    </Grid>
                )}
            </div>
		</div>
	);
}
