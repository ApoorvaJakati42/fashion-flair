import React from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { Link } from 'gatsby';
import { IconButton } from '@material-ui/core';

import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import instagram from '../../images/instagram.svg';

const useStyles = makeStyles(theme => ({
    footer : {
        backgroundColor : theme.palette.primary.main,
        padding : "2rem"
    },
    linkColumn : {
        width : "20rem"
    },
    link : {
        color : "#fff",
        fontSize : "1.25rem"
    },
    linkContainer : {
        [theme.breakpoints.down("md")] : {
            marginBottom : "3rem"
        }
    },
    icon : {
        "&:hover" : {
            backgroundColor : "transparent"
        }
    },
    "@global" : {
        body : {
            margin : 0
        },
       a : {
           textDecoration : "none"
       } 
    }
}))

export default function Footer() {

    const classes = useStyles();

    const socialMedia = [
        {icon : facebook , alt : "facebook" , link : "https://facebook.com"},
        {icon : twitter , alt : "twitter" , link : "https://twitter.com"},
        {icon : instagram , alt : "instagram" , link : "https://instagram.com"}]

    const routes = {
        "Contact Us" : [
            {label : "(080) 2837456465" , href : "tel:(080) 2837456465"} ,
            {label : "apoorva@xyz.com" , href : "mailto:apoorva@xyz.com"}],
        "Customer Service" : [
            {label : "Contact Us" , link : '/contact'} , 
            {label : "My Account" , link : '/account'}] ,
        "Information" : [
            {label : "Privacy Policy" , link : '/privacy-policy'} ,
            {label : "Terms and Conditions" , link : '/terms-conditions'}]
    }    

    return (
        <footer className={classes.footer}>
            <Grid container justify="space-between">
                {/* For Links */}
               <Grid item classes={{root : classes.linkContainer}}>
                <Grid container>

                   {Object.keys(routes).map(category => (
                    <Grid item key={category} container direction="column" classes={{root : classes.linkColumn}}>
                        <Grid item>
                            <Typography variant="h5">{category}</Typography>
                        </Grid>

                        {routes[category].map(route => (
                            <Grid item key={route.label}>
                                <Typography 
                                component={route.link ? Link : "a"} to={route.link ? route.link : undefined} 
                                href={route.href ? route.href : undefined}
                                variant="body1" classes={{body1 : classes.link}}>
                                    {route.label}
                                </Typography>
                            </Grid>
                        ))}
                        
                    </Grid>
                   ))}

                </Grid>
                </Grid> 

                {/* For Social Media Icons */}
                <Grid item >
                <Grid container direction="column" alignItems="center">
                    {socialMedia.map( platform => (
                        <Grid item key={platform.alt}>
                            <IconButton classes={{root : classes.icon}} component="a" href={platform.link} disableRipple>
                                <img src={platform.icon} alt={platform.alt} target="_blank" />
                            </IconButton>
                        </Grid>
                    ))}
                </Grid>
            </Grid> 
            </Grid>
        </footer>
    )
}