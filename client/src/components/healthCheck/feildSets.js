import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

const SourceEnvironment = (props) => {
	const [ open, setOpen ] = useState(false);

	const handleChange = (event) => {
        props.onChange(event);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
    };
    
    const capitaliseText = (text) => {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
    };


	const useStyles = makeStyles((theme) => ({
		h6: {
			display: 'block',
            marginBottom: 0,
            marginTop: '16px'
		},
		formControl: {
			margin: '8px 0',
            minWidth: 300,
            maxWidth: 300,
            width: '100%',
		},
		divider: {
			marginTop: '30px'
		},
		btn: {
			marginTop: '30px'
		},
		gridRight: {
			padding: '10px'
        }
	}));

	const classes = useStyles();

	return (
		<div>
            <h6 className={classes.h6} onClick={handleOpen}>
                {props.title}
            </h6>
			<FormControl className={classes.formControl}>
                <InputLabel id={props.labelId}>Select Your {props.title}</InputLabel>
				<Select
					labelId={props.labelId}
					id={props.id}
					open={open}
					onClose={handleClose}
                    onOpen={handleOpen}
                    name={props.name}
                    value={props.defaultValue}
					onChange={handleChange}>
                    
					{props.dropDowndataInfo &&
						props.dropDowndataInfo.map((listItems, index) => (
                            <MenuItem className={props.name === 'destination' && listItems === 'Any' ? 'hide' : ''} key={index.toString()} value={listItems}>{capitaliseText(listItems)}</MenuItem>
						))}
				</Select>
			</FormControl>
		</div>
	);
};

export default SourceEnvironment;
