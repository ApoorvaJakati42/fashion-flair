import React , {useEffect} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

import { setUser } from '../../contexts/actions';

import checkmark from '../../images/checkmark-outline.svg';
import forward from '../../images/forward-outline.svg';

const useStyles = makeStyles(theme => ({
    iconText : {
        marginTop : "10rem"
    },
    text : {
        color : theme.palette.secondary.main ,
        fontWeight : 700 ,
        textTransform : "none"
    },
    shop : {
        marginLeft : "1rem"
    },
    shopContainer : {
        marginRight : "1rem" ,
        marginBottom: "1rem"
    }
}))

export default function Complete ({user , dispatchUser}) {
    const classes = useStyles();

    useEffect(() => {
        //This is a clean up function ---> This executes only on component unmount
        return () => {
            dispatchUser(setUser({...user , onboarding : true}))
        }
    } , [])

    return (
            <>
            <Grid item container direction="column" alignItems="center" classes={{root : classes.iconText}}>
                <Grid item>
                    <img src={checkmark} alt="signup finished" /> 
                </Grid>  

                <Grid item>
                    <Typography variant="h3" classes={{root : classes.text}}>
                        Account Created !
                    </Typography>
                </Grid>
            </Grid>
              
            <Grid item container justify="flex-end" >
                <Grid item classes={{root : classes.shopContainer}}>
                <Button>
                    <Typography variant="h3" classes={{root : classes.text}}>
                        Shop
                    </Typography>
                    <img src={forward} alt="browse products" className={classes.shop}/>
                </Button>
                </Grid>
            </Grid>

            </>
    )
}