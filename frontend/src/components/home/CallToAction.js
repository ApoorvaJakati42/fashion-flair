import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Link } from 'gatsby';
import { useMediaQuery } from '@material-ui/core';

import cta from "../../images/cta.svg";

const useStyles = makeStyles(theme => ({
    account : {
        color : "#fff",
        marginLeft : "2rem"
    },
    body : {
        maxWidth : "45rem",
        [theme.breakpoints.down("md")] : {
            padding : "0 1rem"
        },
        [theme.breakpoints.down("xs")] : {
            padding : "0",
            fontSize : "1rem"
        }
    },
    container : {
        marginBottom : "15rem"
    },
    buttonContainer : {
        marginTop : "3rem"
    },
    headingContainer : {
        [theme.breakpoints.down("md")] : {
            padding : "0 1rem"
        },
        [theme.breakpoints.down("xs")] : {
            padding : "0"
        }
    },
    icon : {
        [theme.breakpoints.down("xs")] : {
            height : "14rem" ,
            width : "13rem"
        }
    }
}))

export default function CallToAction() {
    const classes = useStyles();
    const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"));

    return (
        <Grid container 
        justify="space-around" classes={{root : classes.container}} 
        direction={matchesMD ? "column" : "row" }
        alignItems="center">
            <Grid item>
                <img src={cta} alt="quality commited" className={classes.icon}/>
            </Grid>
            <Grid item >
                <Grid container direction="column">
                    <Grid item classes={{root : classes.headingContainer}}>
                        <Typography align={matchesMD ? "center" : undefined} variant="h1" >
                            Committed To Quality
                        </Typography>
                    </Grid>
                    <Grid item classes={{root : classes.body}}>
                        <Typography align={matchesMD ? "center" : undefined} variant="body1" >
                            At VAR X our mission is to provide comfortable , durable,
                            premium , designer clothing and clothing accessories to 
                            developers and technology enthusiasts.
                        </Typography>
                    </Grid>
                    <Grid item container justify={matchesMD ? "center" : undefined} classes={{root : classes.buttonContainer}}>
                        <Grid item >
                            <Button variant="outlined" color="primary" component={Link} to="/contact">
                                Contact Us
                            </Button>
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="primary" classes={{root : classes.account}} component={Link} to="/account">
                                Create Account
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

