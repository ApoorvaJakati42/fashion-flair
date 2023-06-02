import React  from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';

import filter from '../../images/filter.svg';
import close from '../../images/close-outline.svg';

const useStyles = makeStyles(theme => ({
    mainContainer : {
        padding : "1rem 0"
    },
    checkbox : {
        color : "#fff"
    },
    optionsContainer : {
        [theme.breakpoints.down("xs")] : {
            "& > :not(:last-child)" : {
                marginBottom : "2rem"
            }
        }
    }
}))

export default function Filter ({setOption , filterOptions , setFilterOptions}) {
    const classes = useStyles();

    const handleFilter = (option , i) => {
        const newFilters = {...filterOptions}
        console.log("option selected " + option);
        console.log("Index clicked : " + i);
        newFilters[option][i].checked = !newFilters[option][i].checked 
        console.log("Checked value" + newFilters[option][i].checked);

        setFilterOptions(newFilters)
    }

    return (
        <Grid item container justify="space-between" alignItems="center" classes={{root : classes.mainContainer}}>
            <Grid item >
                <IconButton onClick={() => setOption(null)}>
                    <img src={filter} alt={filter} />
                </IconButton>
            </Grid>
            <Grid item xs>
            <Grid container justify="space-around" alignItems="center" classes={{root : classes.optionsContainer}}>
                {Object.keys(filterOptions)
                .filter(option => filterOptions[option] !== null)
                .map(option => (
                    <Grid item key={option}>
                        <Grid container direction="column" > 
                            <Grid item> 
                                 <Chip label={option} />
                            </Grid>

                            <Grid item> 
                                 <FormControl>
                                     <FormGroup>
                                         {filterOptions[option].map(({label , checked} , i) => (
                                            <FormControlLabel 
                                            classes={{label : classes.checkbox}} 
                                            key={label} 
                                            label={label} 
                                            control={<Checkbox classes={{root : classes.checkbox}} 
                                            checked={checked} 
                                            name={label}/>} 
                                            onChange={() => handleFilter(option , i)}/>
                                         ))}
                                     </FormGroup>
                                 </FormControl>
                            </Grid>
                        </Grid>
                        
                    </Grid>
                ))}
            </Grid>
            </Grid>
            <Grid item >
                <IconButton onClick={() => setOption(null)}>
                    <img src={close} alt={close} />
                </IconButton>
            </Grid>
        </Grid>
    )
}