import React, { useState, useEffect } from 'react';
import { makeStyles, createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FeildSets from './feildSets';
import formSerialize from 'form-serialize';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MdAlert from 'react-ionicons/lib/MdAlert';
import LinearProgress from '@material-ui/core/LinearProgress';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Loader from 'react-loader-spinner'
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
        maxWidth: '80%',
        background: '#fff',
        padding: '60px 10px 10px'
    },
    button: {
		display: 'inline-block',
		marginTop: theme.spacing(2),
		background: '#c3002f',
		color: '#fff',
		borderRadius: 0,
		'&:hover': { background: '#920023' },
		'&:focus': { background: '#920023' }
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 420
	},
	btn: {
		marginTop: '20px',
		marginLeft: '0'
	},
    h6: {
        display: 'block',
        marginBottom: 0,
        marginTop: '16px'
    },
    feildSets: {
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
    feildSetsItem: {
        paddingRight: '100px'
    },
    healthCheckBox: {
        width: '100%',
        position: 'relative'
    },
    progressBar: {
        height: '124px',
        position: 'absolute',
        width: 'calc(100% + 2px)',
        opacity: '0.2',
        zIndex: 0,
        borderRadius: '4px',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
    },
    loader: {
        position: 'fixed',
        left: 'calc(50% - 25px)',
        top: 'calc(50% - 25px)'
    }
});

const HealthCheck = (props) => {
    const classes = useStyles();
    const [ open, setOpen ] = useState(false);
    
    const [ completed, setCompleted ] = React.useState(0);
    const [ buffer, setBuffer ] = React.useState(0);

    const progress = React.useRef(() => {});
    React.useEffect(() => {
        progress.current = (count) => {
            setCompleted(count);
            setBuffer(count);
        };
	}, []);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

    const [ state, setState ] = useState({
        feedFileData: {},
        healthCheckData: {},
        pageError: false,
        checkError: false,
        checkSuccess: false,
        value: {
            source: '',
            type: ''
		}
    });

    const handleChange = (event) => {
		setState((prevState) => {
            const value = Object.assign({}, prevState.value);
            value[event.target.name] = event.target.value;

			return {
                feedFileData: prevState.feedFileData,
                healthCheckData: prevState.healthCheckData,
                pageError: false,
                checkError: false,
                checkSuccess: false,
                value: value
			};
		});
    };

    const formSubmit = () => {
        if (state && state.processing) {
            return false;
        }
		const form = document.querySelector('#healthcheck');
        const newData = formSerialize(form, { hash: true });
        progress.current(0);

        let results = null;
        const params = {
            "source": newData.source,
            "type": newData.type,
            "market": "US",
            "locale": "en",
            "website": "live",
            "feedFileDestination": "stream5-dev",
            "brand": "nissan"
        }

        progress.current(0);

        setState(prevState => {
            return { feedFileData:prevState.feedFileData, pageError: false, checkError: false,checkSuccess: true, value: prevState.value, healthCheckData: {}, processing: true};
        });

        const fetchData = async () => {
            try {
                results = await axios.post(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/healthCheck`, params);
            } catch (err) {
                setState(prevState => {
                    return { feedFileData:prevState.feedFileData, pageError: false, checkError: true,checkSuccess: false, value: prevState.value, healthCheckData: {}};
                });

            } finally {
                if (results && results.data ) {
                    setState(prevState => {
                        return { feedFileData:prevState.feedFileData, pageError: false, checkError: false, checkSuccess: false, value: prevState.value, healthCheckData: results.data, processing: false, processed: false};
                    });

                    setTimeout( () => {
                        setState(prevState => {
                            return { feedFileData:prevState.feedFileData, pageError: false, checkError: false, checkSuccess: false, value: prevState.value, healthCheckData: results.data, processing: false, processed: true};
                        });
                    }, 1000 );

                    let count = 0;
                    function tick() {
                        count = count + 10;
                        progress.current(count);
                        if (count >= 100) {
                            setState(prevState => {
                                return { feedFileData:prevState.feedFileData, pageError: false, checkError: false, checkSuccess: false, value: prevState.value, healthCheckData: prevState.healthCheckData, processing: false, processed: false };
                            });
                            clearInterval(timer);
                        }
                    }
                    const timer = setInterval(tick, 10);
                }
            }
        }

        fetchData();
    };

    const handleErrorClose = () => {
        setState((prevState) => {
            return { feedFileData:prevState.feedFileData, pageError: false, checkError: false,checkSuccess: false, value: prevState.value, healthCheckData: prevState.healthCheckData};
        });
    };

    const capitaliseText = (text) => {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
    };

    const arrowIcon = () => {
        return <ArrowRightIcon style={{ fontSize: 55, color: '#000' }} />;
    }
    
    const QontoStepIcon = (status) => {
        return (
            <div>
                {(status === "200") ? <CheckCircleOutlineIcon style={{ fontSize: 50, color: 'green' }} /> : <MdAlert fontSize="70px" color="#ff0202" beat={true} />}
            </div>
        );
    }

    useEffect(() => {
		const fetchData = async () => {
            let result = null;

            let value = {
                source: '',
                type: ''
            };

            try {
                result = await axios.get(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/environmentDetails`);
            } catch (err) {
                setState({ feedFileData: {}, pageError: true, checkError: false });
            } finally {
                if (result && result.data && result.data.feedFileSelections && result.data.feedFileSelections.destinationEnvironment  && result.data.feedFileSelections.destinationEnvironment.length) {
                    value.source = result.data.feedFileSelections.destinationEnvironment[0];
                    value.type = result.data.feedFileSelections.feedFileType[0];
                    setState({ feedFileData: result.data, value: value, pageError: false, checkError: false, checkSuccess: false });
                } else {
                    setState({ feedFileData: {}, value: value, pageError: true, checkError: false, checkSuccess: false });
                }
            }
		};

		fetchData();
    }, []);

	return (
		<div className={classes.wrapper}>
			<ThemeProvider theme={theme}>
				<Typography variant='h4' className={classes.title}>
					Health Check
				</Typography>

                <Grid container spacing={3}>
                    {state && !state.pageError ? (
                        <section>
                            <form name='healthcheck' id='healthcheck' onSubmit={formSubmit} className={classes.feildSets}>
                                <div className={classes.feildSetsItem}>
                                    <FeildSets
                                        dropDowndataInfo={state.feedFileData && state.feedFileData.feedFileSelections &&
                                            state.feedFileData.feedFileSelections.destinationEnvironment}
                                        title={'Health check source'}
                                        name='source'
                                        defaultValue={state.value.source}
                                        onChange={handleChange}
                                        labelId='source-label'
                                        id='sourceID'
                                    />
                                </div>
                                <div className={classes.feildSetsItem}>
                                    <FeildSets
                                        dropDowndataInfo={state.feedFileData && state.feedFileData.feedFileSelections &&
                                            state.feedFileData.feedFileSelections.feedFileType}
                                        title={'Health check type'}
                                        name='type'
                                        defaultValue={state.value.type}
                                        onChange={handleChange}
                                        labelId='type-label'
                                        id='typeID'
                                    />
                                </div>
                                <Button
                                    variant='contained'
                                    className={classes.button}
                                    onClick={() => formSubmit()}>
                                    Submit
                                </Button>
                            </form>
                            <section className={classes.healthCheckBox} >
                                <div className='health-check'>
                                    {state && state.healthCheckData && state.healthCheckData.healthCheck ? (
                                        <div>
                                            <LinearProgress className={classes.progressBar} variant='buffer' value={completed} valueBuffer={buffer}  />
                                            {state && state.processed ? (
                                                <Stepper className={classes.paper}>
                                                    {state.healthCheckData.healthCheck.map((task, index) => {
                                                        return (
                                                            <Step key={index.toString()} >
                                                                <StepLabel StepIconComponent={arrowIcon}>{QontoStepIcon(task.status)} {capitaliseText(task.name)}</StepLabel>
                                                            </Step>
                                                        )
                                                    })}
                                                </Stepper>
                                            ) : (
                                                <Stepper className={classes.paper}>
                                                    {state.healthCheckData.healthCheck.map((task, index) => {
                                                        return (
                                                            <Step key={index.toString()} >
                                                                <StepLabel StepIconComponent={arrowIcon}><AccessTimeIcon style={{ fontSize: 55, color: '#000' }} />
                                                                <div>{capitaliseText(task.name)}</div>
                                                                </StepLabel>
                                                            </Step>
                                                        )
                                                    })}
                                                </Stepper>
                                            )}
 
                                        {state.healthCheckData.jiraUrl && state.processed ? (
                                            <Snackbar className="error-message" open={true} >
                                                <MuiAlert elevation={8} variant="filled" severity="error" >
                                                A Jira ticket is logged for this incident,
                                                        <a target="_blank" href={state.healthCheckData.jiraUrl}> please click here for more details</a>
                                                </MuiAlert>
                                            </Snackbar>
                                        ) : (
                                        <Snackbar open={state.checkSuccess } onClose={handleErrorClose} autoHideDuration={4000} >
                                            <MuiAlert elevation={6} onClose={handleErrorClose} variant="filled" severity="success" >
                                                Health Check Success for the given inputs - {state.value.source} & {state.value.type}
                                            </MuiAlert>
                                        </Snackbar>
                                        )}
                                        </div>
                                    
                                    ) : (
                                        <div>
                                            {state.processing ? (
                                               <Loader
                                                className={classes.loader}
                                                type="Bars"
                                                color="#c3002f"
                                                height={50}
                                                width={50}
                                                timeout={3000} //3 secs
                                                />
                                            ) : (
                                                ''
                                            )
                                            }
                                        </div>
                                    )}

                                    <Snackbar open={state.checkError} onClose={handleErrorClose} autoHideDuration={5000} >
                                        <MuiAlert elevation={6} onClose={handleErrorClose} variant="filled" severity="error" >
                                            Health Check Failed - Network Error
                                        </MuiAlert>
                                    </Snackbar>

                                    <Snackbar open={state.checkSuccess} onClose={handleErrorClose} autoHideDuration={2000} >
                                        <MuiAlert elevation={6} onClose={handleErrorClose} variant="filled" severity="success" >
                                            Health Check Initialed
                                        </MuiAlert>
                                    </Snackbar>
                                    </div>
                            </section>
                        </section>
                     ) : (
                        <Snackbar open={true}  >
                            <MuiAlert elevation={6} variant="filled" severity="error" >
                            Unable to load Data - Network Error
                            </MuiAlert>
                        </Snackbar>
                    )}
                    
                </Grid>
			</ThemeProvider>
		</div>
	);
}

export default HealthCheck;
