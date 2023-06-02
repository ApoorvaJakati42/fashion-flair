import React , {useState} from 'react';
import { Grid } from '@material-ui/core';
import clsx from "clsx";
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import shippingIcon from '../../images/shipping.svg'

const useStyles = makeStyles(theme => ({
    button : {
        backgroundColor : theme.palette.secondary.main ,
        borderRadius : 15 ,
        height : "10rem" ,
        width : "10rem" ,
        [theme.breakpoints.down("xs")] : {
            height : "6rem",
            width : "6rem"
        },
        "&:hover" : {
            backgroundColor : theme.palette.secondary.light
        }
    },
    label : {
        fontSize : "1.5rem",
        [theme.breakpoints.down("xs")] : {
            fontSize : "0.9rem"
        }
    },
    container : {
        height : "100%" ,
        // default value of display is "flex" so it gives the style to grid
        display : ({ selectedStep , stepNumber}) =>  selectedStep !== stepNumber ? "none" : "flex" 
    },
    icon : {
        marginTop : "-2rem" ,
        marginBottom : "1rem"
    },
    price : {
        color : "#fff",
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.25rem"
        }
    },
    selected : {
        backgroundColor : "#fff" ,
        "&:hover" : {
            backgroundColor : "#fff"
        }
    },
    selectedText : {
        color : theme.palette.secondary.main
    }
}))

export default function Shipping ({shippingOptions , selectedShipping , setSelectedShipping , selectedStep , stepNumber}) {
    const classes = useStyles({ selectedStep , stepNumber});

    return (
        <Grid item container direction="column" alignItems="center" justify='center' classes={{ root : classes.container}}>
            <Grid item >
                <img src={shippingIcon} alt="shipping" className={classes.icon}/>
            </Grid>

            <Grid item container justify='space-around'>
                {shippingOptions.map(option => (
                    <Grid item key={option.label} >
                        <Button classes={{ root : clsx(classes.button , {
                            [classes.selected] : selectedShipping === option.label
                        })}} 
                        onClick={() => setSelectedShipping(option.label)}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="h5" classes={{ root : clsx(classes.label , {
                                        [classes.selectedText] : selectedShipping === option.label 
                                    })}}>
                                       {option.label}
                                    </Typography>
                                </Grid>
                                
                                <Grid item>
                                    <Typography variant="body1" classes={{root : clsx(classes.price , {
                                        [classes.selectedText] : selectedShipping === option.label
                                    })}}>
                                        {`Rs. ${option.price.toFixed(2)}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}