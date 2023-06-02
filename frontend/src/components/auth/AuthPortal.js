import React , {useState , useContext , useEffect} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import SignUp from './SignUp';
import Complete from './Complete';
import Reset from './Reset';
import axios from 'axios';

import Login from './Login';
import { UserContext } from '../../contexts';
import { FeedBackContext } from '../../contexts';
import {setUser , setSnackbar} from '../../contexts/actions'

const useStyles = makeStyles(theme => ({
    container: {
        marginBottom : "8rem",
        [theme.breakpoints.down("md")] : {
            marginTop : "5rem"
        }
    },
    paper : {
        border : `2rem solid ${theme.palette.secondary.main}` ,
        width : "50rem" ,
        height : "40rem" ,
        borderRadius : 0 ,
        [theme.breakpoints.down("md")] : {
            width : "28rem"
        },
        [theme.breakpoints.down("xs")] : {
            width : "calc(100vw - 3rem)",
            borderWidth : "1rem"
        }
    },
    inner : {
        height : "40rem" ,
        width : "100%" ,
        border : `2rem solid ${theme.palette.primary.main}` ,
        [theme.breakpoints.down("xs")] : {
            borderWidth : "1rem"
        }
    },
    "@global" : {
        ".MuiInput-underline:before , .MuiInput-underline:hover:not(.Mui-disabled):before" : {
            borderBottom : `2px solid ${theme.palette.secondary.main} `   
        },
        ".MuiInput-underline:after" : {
          borderBottom : `2px solid ${theme.palette.primary.main} `
        }
      }
}))

export default function AuthPortal () {
    const classes = useStyles();

    const [selectedStep , setSelectedStep] = useState(0);

    const {user , dispatchUser} = useContext(UserContext)

    const {feedback , dispatchFeedback} = useContext(FeedBackContext);
   

    const steps = [
        {component : Login , label : "Login"},
        {component : SignUp , label : "SignUp"} ,
        {component : Complete , label : "Complete"} ,
        {component : Reset , label : "Reset"}]

    useEffect(() => {
        //SendGrid code start
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        const access_token = params.get("access_token")

        if (code) {
            const resetStep = steps.find(step => step.label === "Reset")
            setSelectedStep(steps.indexOf(resetStep))
        }
        //SendGrid code end
        else if (access_token) {
            axios.get(process.env.GATSBY_STRAPI_URL + "/auth/facebook/callback" , {
                params : { access_token }
            }).then(response => {
                dispatchUser(setUser({...response.data.user , jwt : response.data.jwt , onboarding : true}))

                window.history.replaceState(null , null , window.location.pathname)
            }).catch(error => {
                console.error(error)
                dispatchFeedback(setSnackbar({"status" : "error" , message : "Connection To Facebook failed"}))
            })
        }
    } , [])    

    return (
        <Grid container justify="center" classes={{root : classes.container}}>
            <Grid item>
                <Paper elevation={6} classes={{root : classes.paper}}>
                    <Grid container direction="column" alignItems="center" justify="space-between" classes={{root : classes.inner}}>
                        {steps.map((Step , i) => (
                            selectedStep === i ? 
                            <Step.component  
                            key={Step.label} 
                            setSelectedStep={setSelectedStep} 
                            steps={steps}
                            user={user}
                            dispatchUser={dispatchUser}
                            feedback={feedback}
                            dispatchFeedback={dispatchFeedback}/> 
                            : null
                        ))}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    )
}