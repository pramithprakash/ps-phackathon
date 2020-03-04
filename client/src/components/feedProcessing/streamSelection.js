import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FeildSets from './feildSets';
import formSerialize from 'form-serialize';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import Loader from 'react-loader-spinner'


const useStyles = makeStyles((theme) => ({
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
	divider: {
		marginTop: '30px'
	},
	btn: {
		marginTop: '10px',
		marginLeft: '0'
    },
    check: {
        marginTop: '15px',
		marginLeft: '0'
    },
	gridRight: {
		padding: '10px'
	},
	error: {
        background: '#f00',
        fontSize: '12px',
        marginLeft: '0',
        display: 'inline-block',
        padding: '3px 6px',
        color: '#fff',
        borderRadius: '7px'
    },
    errorIcon : {
        verticalAlign: 'top',
        marginRight: '4px'
    },
    loader: {
        position: 'fixed',
        left: 'calc(50% - 25px)',
        top: 'calc(50% - 25px)'
    }
}));

const StreamSelection = (props) => {
	const classes = useStyles();
    const currentFileStatus = props && props.feedFileStatus;

	const [ state, setState ] = useState({
		error: {
			source: false,
			destination: false,
			type: false,
			market: false,
            website: false,
            brand: false
		},
		selectedDesitnation: '',
        selectedType: '',
        healthSwitched: false,
        value: {
			source: '',
			destination: '',
			type: '',
			market: '',
            website: '',
            brand: ''
		}
    });
    

    const handleClose = () => {
        setState((prevState) => {
        const error = Object.assign({}, prevState.error);
        
            error.inprogress = false;
            return {
                error,
                selectedDesitnation: '',
                selectedType: '',
                healthSwitched: prevState.healthSwitched,
                value: prevState.value
            };
        });
    };

	const handleChange = (event) => {
		setState((prevState) => {
            const error = Object.assign({}, prevState.error);
            const value = Object.assign({}, prevState.value);
            error[event.target.name] = false;
            
            value[event.target.name] = event.target.value;
            
			error.inprogress = false;
			return {
                error,
                value,
                healthSwitched: prevState.healthSwitched,
				selectedDesitnation: '',
				selectedType: ''
			};
		});
    };

    const handleSwitchChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
      };

    const updateErrorStatus = () => {
        props.updateErrorStatus();
    };

    const healthCheck = async (params) => {
        let results;
        try {
            results = await axios.get(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/healthCheck`, params);
        } catch (err) {
            setState((prevState) => {
                return {
                    error: prevState.error,
                    selectedDesitnation: prevState.selectedDesitnation,
                    selectedType: prevState.selectedType,
                    healthSwitched: prevState.healthSwitched,
                    value: prevState.value,
                    healthCheckData: {}
                };
            });
    
        } finally {
            if (results && results.data ) {
                setState((prevState) => {
                    return {
                        error: prevState.error,
                        selectedDesitnation: prevState.selectedDesitnation,
                        selectedType: prevState.selectedType,
                        healthSwitched: prevState.healthSwitched,
                        value: prevState.value,
                        healthCheckData: results.data
                    };
                });

                returnHealthData(results.data)
            }
        }
    };

    const returnHealthData = (data) => {
        const healthCheckData = {};
        let errorList = [];

        data.healthCheck.map(function(value, label) {
            if (value.status !== "200") {
                errorList.push(value.name);
            }
        });
        healthCheckData.jiraUrl = data.jiraUrl;
        healthCheckData.errorList = errorList;

        props.healthCheckStatus(healthCheckData);

        return errorList.length > 0 ? true : false;
    };

	const formSubmit = (props) => {
		const form = document.querySelector('#feedfile');
		const newData = formSerialize(form, { hash: true });
		const error = {
			source: false,
			destination: false,
			type: false,
			market: false,
            website: false,
            brand: false,
			inprogress: false
        };
        
        updateErrorStatus();

        if (newData.source && newData.destination && newData.type && newData.market && newData.website && newData.brand) {

            if (state.healthSwitched && healthCheck(newData)) {
                return false;
            }

            if (currentFileStatus) {
				currentFileStatus.map(function(value, label) {
                    
					if (value.status === 'inprogress') {
						if (value.source === newData.source && value.destination === newData.destination && value.type === newData.type && value.website === newData.website && value.market === newData.market.split('_')[1]&& value.brand === newData.brand && value.locale === newData.market.split('_')[0]) {
                            error.inprogress = true;

							setState((prevState) => {
								return {
									error,
                                    selectedDesitnation: newData.destination,
                                    healthSwitched: prevState.healthSwitched,
                                    selectedType: newData.type,
                                    value: prevState.value
								};
							});
						}
					}
				});
			} 
			if (!error.inprogress) {
                setState((prevState) => {
                    return {
                        error,
                        selectedDesitnation: prevState.destination,
                        selectedType: prevState.type,
                        healthSwitched: prevState.healthSwitched,
                        value: {
                            source: '',
                            destination: '',
                            type: '',
                            market: '',
                            website: '',
                            brand: ''
                        }
                    };
                });
				return newData;
			}
		} else {
			if (!newData.source) {
				error.source = true;
			}
			if (!newData.destination) {
				error.destination = true;
			}
			if (!newData.type) {
				error.type = true;
			}
			if (!newData.market) {
				error.market = true;
			}
			if (!newData.website) {
				error.website = true;
            }
            if (!newData.brand) {
				error.brand = true;
			}

			error.inprogress = false;

			setState((prevState) => {
				return {
					error,
                    selectedDesitnation: '',
                    healthSwitched: prevState.healthSwitched,
                    selectedType: '',
                    value: prevState.value
				};
			});
		}
	};

	if (props && props.feedFileSelections) {
		return (
			<form name='feedfile' id='feedfile' onSubmit={formSubmit}>
				<FeildSets
					dropDowndataInfo={props.feedFileSelections.sourceEnvironment}
					title={'Source Environment'}
                    name='source'
                    labelId='souce-label'
                    id='sourceId'
                    defaultValue={state.value.source}
					onChange={handleChange}
				/>
				{state.error.source ? <div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Source Environment</div> : ''}
				<FeildSets
					dropDowndataInfo={props.feedFileSelections.destinationEnvironment}
					title={'Destination Environment'}
                    name='destination'
                    labelId='destination-label'
                    id='destinationId'
                    defaultValue={state.value.destination}
					onChange={handleChange}
				/>
				{state.error.destination ? (
					<div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Destination Environment</div>
				) : (
					''
				)}
				<FeildSets
					dropDowndataInfo={props.feedFileSelections.market}
					title={'Market'}
                    name='market'
                    labelId='market-label'
                    id='marketId'
                    defaultValue={state.value.market}
					onChange={handleChange}
				/>
				{state.error.market ? <div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Market</div> : ''}
				<FeildSets
					dropDowndataInfo={props.feedFileSelections.site}
					title={'Website'}
                    name='website'
                    labelId='website-label'
                    id='websiteId'
                    defaultValue={state.value.website}
					onChange={handleChange}
				/>
				{state.error.website ? <div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Website</div> : ''}
				<FeildSets
					dropDowndataInfo={props.feedFileSelections.feedFileType}
					title={'Feed File Type'}
                    name='type'
                    labelId='type-label'
                    id='typeId'
                    defaultValue={state.value.type}
					onChange={handleChange}
				/>
				{state.error.type ? <div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Feed File Type</div> : ''}
                <FeildSets
					dropDowndataInfo={props.feedFileSelections.brand}
					title={'Brand'}
                    name='brand'
                    labelId='brand-label'
                    id='brandId'
                    defaultValue={state.value.brand}
					onChange={handleChange}
				/>
				{state.error.type ? <div className={classes.error}><ErrorOutlineIcon className={classes.errorIcon} style={{ fontSize: 15, color: '#fff' }} />Please enter Brand</div> : ''}

                <FormGroup row className={classes.check}>
                    <FormControlLabel control={
                        <Switch
                            checked={state.healthSwitched}
                            onChange={handleSwitchChange('healthSwitched')}
                            value="healthSwitched"
                            color="secondary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    }label="Health Check" />
                </FormGroup>
				<div className={classes.btn}>
					<Button
						variant='contained'
						className={classes.button}
						onClick={() => props.updateState(formSubmit())}>
						Submit
					</Button>
					{state.error.inprogress ? (
                        <Snackbar open={state.error.inprogress} onClose={handleClose} autoHideDuration={10000} >
                            <MuiAlert elevation={6} variant="filled" severity="error" onClose={handleClose}>
                            {state.selectedType} file processing for {state.selectedDesitnation} in progress
                            </MuiAlert>
                        </Snackbar>
					) : (
						''
					)}
				</div>
			</form>
		);
	} else {
		return (<div>
            <Loader
                className={classes.loader}
                type="Bars"
                color="#c3002f"
                height={50}
                width={50}
                timeout={3000} //3 secs
            />
        </div>
        );
	}
};

export default StreamSelection;
