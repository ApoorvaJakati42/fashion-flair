import React  from 'react';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Chip } from '@material-ui/core';
import clsx from 'clsx';

import sort from '../../images/sort.svg';
import close from '../../images/close-outline.svg';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

const useStyles = makeStyles(theme => ({
    chipContainer : {
        [theme.breakpoints.down("md")] : {
            margin : "0.5rem"
        }
    },
    notActive : {
        backgroundColor : theme.palette.primary.main
    }
}))

export default function Sort ({setOption , sortOptions , setSortOptions}) {

    const classes = useStyles();
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

    const handleSort = i => {
        const newOptions = [...sortOptions]

        newOptions.map(option => (option.active = false))

        newOptions[i].active = true

        setSortOptions(newOptions)

    }
   
    return (
        <Grid item container justify="space-between" alignItems="center" >
            <Grid item >
                <IconButton onClick={() => setOption(null)}>
                    <img src={sort} alt={sort} />
                </IconButton>
            </Grid>
            <Grid item xs>
            <Grid container justify="space-around" alignItems="center" direction={matchesXS ? "column" : "row"}>
                {sortOptions.map((option , i) => (
                    <Grid classes={{root : classes.chipContainer}} item key={option.label}>
                        <Chip label={option.label} color={option.active !== true ? "primary" : "secondary"} onClick={() => handleSort(i)} classes={{root : clsx({
                            [classes.notActive] : option.active !== true
                        })}}/>
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