import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Chart from '../chart/Chart';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import {Pie} from 'react-chartjs-2';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import IosSync from 'react-ionicons/lib/IosSync';
import MdAlert from 'react-ionicons/lib/MdAlert';
import MdCheckmarkCircleOutline from 'react-ionicons/lib/MdCheckmarkCircleOutline';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
	title: {
		padding: '20px',
		textTransform: 'uppercase'
	},
	wrapper: {
        margin: '0 auto',
        maxWidth: '100%',
        background: '#fff',
        paddingTop: '30px',
        paddingLeft: '35px'
	},
	chartSection: {
        margin: '8px',
        background: '#fff',
        paddingTop: '20px',
        paddingBottom: '20px',
        textAlign: 'center'
    },
    boxSection: {
        margin: '8px',
        background: '#fff'
    },
    avatar: {
        background: '#fff',
        height: 100,
        width: 100,
        marginRight: 20
    },
    listItem: {
        padding: 0
    },
    listItemAvatar: {
        padding: 0
    },
    list: {
        padding: 0,
        margin: 0
    },
    statusContainer: {
        marginBottom: '20px'
    },
    formControl : {
        textAlign: 'left',
        marginLeft: '10px',
        width: '100%'
	},
	pieChartilter: {
		borderBottom: '1px dotted',
		paddingBottom: '10px',
		marginBottom: '20px'
	},
	pieChartilterLabel: {
		position: 'relative',
		top: '6px',
        fontSize: '14px',
        display: 'block'
    },
    leftSection: {
        float: 'left',
        width: '50%'
    },
    rightSection: {
        float: 'left',
        width: '50%'
    },
    filterContainer: {
        width: '100%'
    }
});

export default function Dashboard() {
    const classes = useStyles();
    const [ stream, setStream ] = useState('');
    const [ type, setType ] = useState('');

    const [ open, setOpen ] = useState(false);
    const [ openType, setOpenType ] = useState(false);

	const [ state, setState ] = useState({
        feedFileData: {},
        animation: true,
        error : false
    });
    
    const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
    };

    const handleCloseType = () => {
		setOpenType(false);
	};

	const handleOpenType = () => {
		setOpenType(true);
    };

    const getStreamStatus = (data, selectedStream) => {
        let streamStatusSuccess = 0;
        let streamStatusProgress = 0;
        let streamStatusError = 0;
        let getStreamCount = [];
        const streamItems = data.feedFileStatus.length && data.feedFileStatus.map((stream) => stream.destination);
        const removeDuplicateItem = Array.from(new Set(streamItems));

        data.feedFileStatus.map((item) => {
            if (item.destination === (selectedStream || removeDuplicateItem[0])) {
                if (item.status === 'done') {
                    streamStatusSuccess++;
                } else if (item.status === 'inprogress') {
                    streamStatusProgress++;
                } else if (item.status === 'error') {
                    streamStatusError++;
                }
            }
        });

        getStreamCount.push(streamStatusSuccess);
        getStreamCount.push(streamStatusProgress);
        getStreamCount.push(streamStatusError);
        return getStreamCount;
    };

    const getTypeStatus = (data, selectedType, streamItems) => {
        let getTypeStreamArray = [];
        let count = 0;

        const typeItems = data.feedFileStatus.map((type) => type.type);
        const removeDuplicateTypeItem = Array.from(new Set(typeItems));

        data.feedFileStatus.map((item) => {
            count = 0;
            streamItems.map((stream) => {
                if (stream === item.destination && item.type === (selectedType)) {
                    count++;
                }
            });
            getTypeStreamArray.push(count);
        });

        return getTypeStreamArray;
    };

    const feedFileStreamStatus = (data, selectedStream) => {
        const feedFileStreamStatusData = {
                labels: ['Success', 'In Progress', 'Error'],
                datasets: [
                    {
                        data: getStreamStatus(data, selectedStream),
                        backgroundColor: [
                            'rgba(0, 128, 0)',
                            'rgba(255, 127, 2)',
                            'rgba(255, 2, 2)'
                        ]
                    }
                ]
            }

        return feedFileStreamStatusData;
    };

    const feedFileTypeStatus = (data, selectedType) => {
        const streamItems = data.feedFileStatus.length && data.feedFileStatus.map((stream) => stream.destination);
        const removeDuplicateItem = Array.from(new Set(streamItems));
        const feedFileTypeStatusData = {
                labels: removeDuplicateItem,
                datasets: [
                    {
                        data: getTypeStatus(data, selectedType, streamItems),
                        backgroundColor: [
                            'rgba(0, 128, 0)',
                            'rgba(255, 127, 2)',
                            'rgba(255, 2, 2)'
                        ]
                    }
                ]
            }

        return feedFileTypeStatusData;
    }
    
	const handleChange = (event) => {
        setStream(event.target.value);

        setState(prevState => {
            return { 
                data: prevState.data,
                chartInfo: prevState.chartInfo,
                healthCheckInfo: prevState.healthCheckInfo,
                statusCountData: prevState.statusCountData,
                pieChartData: feedFileStreamStatus(prevState.data, event.target.value),
                streamList: prevState.streamList,
                selectedStream: event.target.value,
                selectedType: prevState.selectedType,
                animation: false,
                feedTypeItemList: prevState.feedTypeItemList,
                filterByStream: true,
                filterByType: false
            }
        })
    };
    
    const handleChangeType = (event) => {
        setType(event.target.value);

        setState(prevState => {
            return { 
                data: prevState.data,
                chartInfo: prevState.chartInfo,
                healthCheckInfo: prevState.healthCheckInfo,
                statusCountData: prevState.statusCountData,
                pieChartData: feedFileTypeStatus(prevState.data, event.target.value),
                streamList: prevState.streamList,
                selectedStream: prevState.selectedStream,
                selectedType: event.target.value,
                animation: false,
                feedTypeItemList: prevState.feedTypeItemList,
                filterByStream: false,
                filterByType: true
            }
        })
	};

	useEffect(() => {
		const fetchData = async () => {

            let result = null;
            try {
                result = await axios.get(`http://ec2-3-86-247-124.compute-1.amazonaws.com:9090/feedFileProcess/environmentDetails`);
            } catch (err) {
                setState({ feedFileData: {}, error: true, animation: false });
            } finally {
                if (result && result.data && result.data.feedFileStatus.length) {
                    const streamItems = result.data.feedFileStatus.map((stream) => stream.destination);

                    const feedTypeItems= result.data.feedFileStatus.map((feedType) => feedType.type);

                    const removeDuplicateItem = Array.from(new Set(streamItems));
                    const removeDuplicateTypeItem = Array.from(new Set(feedTypeItems));

                    const streamList = removeDuplicateItem;
                    const feedTypeItemList = removeDuplicateTypeItem;
                    const getStreamCount = [];
                    const getStreamCountHealth = [];

                    const sepatateStreamCount = (streams) => {
                        const streamCount = streams;
                        const count = {};

                        streamCount.forEach(function(i) {
                            count[i] = (count[i] || 0) + 1;
                        });

                        getStreamCount.push(Object.values(count));
                        return getStreamCount;
                    };

                    const sepatateStreamCountHealth = (streams) => {
                        const streamCount = streams;
                        const count = {};

                        streamCount.forEach(function(i) {
                            count[i] = (count[i] || 0) + 1;
                        });

                        getStreamCountHealth.push(Object.values(count));
                        return getStreamCountHealth;
                    };

                    sepatateStreamCount(streamItems);

                    const feedFileStreams = {
                        chartData: {
                            labels: removeDuplicateItem,
                            datasets: [
                                {
                                    data: getStreamCount[0],
                                    backgroundColor: [
                                        'rgba(146, 0, 35)',
                                        'rgba(168, 88, 107)',
                                        'rgba(103, 5, 28)',
                                        'rgba(83, 41, 51)'
                                    ]
                                }
                            ]
                        },
                        options: {
                            title: {
                                display: false,
                                text: 'FEED FILE PROCESSING'
                            }
                        },
                        routeInfo: {
                            cta: 'More Details',
                            herf: '/feed'
                        }
                    };
                    
                    const statusCountData = () => {
                        let success = 0;
                        let inprogress = 0;
                        let error = 0;

                        result.data.feedFileStatus.map((status) => {
                            if (status.status === 'done') {
                                success++;
                            } else if (status.status === 'inprogress') {
                                inprogress++;
                            } else if (status.status === 'error') {
                                error++;
                            }
                        });

                        const count = {
                            'success': success,
                            'inprogress': inprogress,
                            'error': error
                        };

                        return count;
                    };

                    setState({
                        data: result.data,
                        chartInfo: feedFileStreams,
                        pieChartData: feedFileStreamStatus(result.data),
                        statusCountData: statusCountData(),
                        streamList: streamList,
                        selectedStream: streamList[0],
                        feedTypeItemList: feedTypeItemList,
                        selectedType: feedTypeItemList[0],
                        animation: true,
                        filterByStream: true,
                        filterByType: false,
                        selectedTypeStream: ''
                    });

                    setTimeout( () => 
                        setState(prevState => {
                            return { 
                                data: prevState.data,
                                chartInfo: prevState.chartInfo,
                                pieChartData: prevState.pieChartData,
                                statusCountData: prevState.statusCountData,
                                streamList: prevState.streamList,
                                selectedStream: prevState.selectedStream,
                                feedTypeItemList: prevState.feedTypeItemList,
                                selectedType: prevState.selectedType,
                                animation: false,
                                filterByStream: prevState.filterByStream,
                                filterByType: prevState.filterByType,
                                selectedTypeStream: prevState.selectedTypeStream
                            }
                        }), 3000
                    )

                } else {
                    setState({ feedFileData: {}, error: false, animation: false, noData: true });
                }
            }
		};

		fetchData();
    }, []);


	return (
        <div>
            {state.error || state.noData ? (
                <Snackbar open={true}>
                    <MuiAlert elevation={6} variant="filled" severity="error" >
                        {state.noData ? (
                            "No Data available"
                        ) : (
                            "Unable to load the data - Network Error"
                        )
                        }
                     
                    </MuiAlert>
                </Snackbar>
            ) : (
            <div className={classes.wrapper}>
                {state.animation}
                <Grid container className={classes.statusContainer}>
                    <Grid item xs={4}>
                        <Paper className={classes.boxSection}>
                            <List className={classes.list}>
                            <ListItem className={classes.listItem}>
                                <ListItemAvatar className={classes.listItemAvatar}>
                                <Avatar className={classes.avatar}>
                                    <MdCheckmarkCircleOutline fontSize="60px" color="green" shake={state.animation} />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Success" secondary={state && state.statusCountData && state.statusCountData.success} />
                            </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.boxSection}>
                        <List className={classes.list}>
                            <ListItem className={classes.listItem}>
                                <ListItemAvatar className={classes.listItemAvatar}>
                                <Avatar className={classes.avatar}>
                                    <IosSync fontSize="60px" color="#ff7f02" rotate={state.animation} />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="In Progress" secondary={state && state.statusCountData && state.statusCountData.inprogress} />
                            </ListItem>
                        </List>   
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.boxSection}>
                            <List className={classes.list}>
                                <ListItem className={classes.listItem}>
                                    <ListItemAvatar className={classes.listItemAvatar}>
                                    <Avatar className={classes.avatar}>
                                        <MdAlert fontSize="60px" color="#ff0202" beat={state.animation} />
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Errors" secondary={state && state.statusCountData && state.statusCountData.error} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6}>
                        <div className={classes.chartSection}>
                        {state && state.chartInfo ? (
                            <Chart chartDataProps={state && state.chartInfo} />
                        ) : (
                            ""
                        )}
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className={classes.chartSection}>
                        {state && state.pieChartData ? (

                        <div className="status-section">
							<div className={classes.pieChartilter}>
                                <FormControl className={classes.formControl}>
                                <Grid container spacing={3} className={classes.filterContainer}>
                                    <Grid item xs={6}>
                                         <label className={classes.pieChartilterLabel}>
                                            Filter by Stream:
                                        </label>
                                         <Select
                                            className={state.filterByStream ? 'active' : ''}
                                            labelId='stream-select-label'
                                            id='stream-select'
                                            open={open}
                                            onClose={handleClose}
                                            onOpen={handleOpen}
                                            name={'filter Stream'}
                                            value={state.selectedStream}
                                            onChange={handleChange}>
                                            {state &&
                                                state.streamList.map((listItems, index) => (
                                                    <MenuItem key={index.toString()} value={listItems}>{listItems}</MenuItem>
                                                ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                         <label className={classes.pieChartilterLabel}>
                                            Filter by Type:
                                        </label>
                                         <Select
                                            className={state.filterByType ? 'active' : ''}
                                            labelId='type-select-label'
                                            id='type-select'
                                            open={openType}
                                            onClose={handleCloseType}
                                            onOpen={handleOpenType}
                                            name={'filter Type'}
                                            value={state.selectedType}
                                            onChange={handleChangeType}>
                                            {state &&
                                                state.feedTypeItemList.map((typeItems, index) => (
                                                    <MenuItem key={index.toString()} value={typeItems}>{typeItems}</MenuItem>
                                                ))}
                                        </Select>
                                    </Grid>
                                </Grid>

								</FormControl>
							</div>
                            <Pie width={160} height={100} data={state && state.pieChartData} />
                            </div>
                        ) : (
                            ""
                        )}
                        </div>
                    </Grid>
                </Grid>
            </div>
            )}
        </div>
	);
}
