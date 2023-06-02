import React , {useState , useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { EmailPassword } from './Login';
import Fields from './Fields';
import accountIcon from '../../images/account.svg';
import { Grid, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { setSnackbar } from '../../contexts/actions';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    reset : {
        width : "20rem" ,
        borderRadius : 50 ,
        textTransform : "none",
        marginBottom : "4rem",
        [theme.breakpoints.down("xs")] : {
            width : "15rem"
        }
    },
    icon : {
        marginTop : "2rem"
    },
     buttonText : {
        [theme.breakpoints.down("xs")] : {
             fontSize : "1.5rem"
        }
    }
}))

export default function Reset ({ steps , setSelectedStep , dispatchFeedback}) {
    const classes = useStyles();

    const [visible , setVisible] = useState(false);

    const [values , setValues] = useState({ password : "" , confirmation : ""})

    const [errors , setErrors] = useState({})

    const [loading , setLoading] = useState(false);

    const [success , setSuccess] = useState(false)

    const { password } = EmailPassword(true , false , visible , setVisible)

    const fields = { 
                    password , 
                    confirmation : 
                    { ...password , placeholder : "Confirm Password"}
                }
            
    const handleReset = () => {
        setLoading(true)
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")
        console.log(code);

        axios.post(process.env.GATSBY_STRAPI_URL + "/auth/reset-password" , {
            code ,
            password : values.password,
            passwordConfirmation : values.confirmation
        }).then(response => {
            setLoading(false)
            setSuccess(true)
            dispatchFeedback(setSnackbar({status : "success" , message : "Password Reset Successfully"}))

        }).catch(error => {
            setLoading(false)
            const {message} = error.response.data.message[0].messages[0]
            console.error(error)
            dispatchFeedback(setSnackbar({status : "error" , message }))
        })
    }            

    const disabled = Object.keys(errors).some(error => errors[error] === true)
    || Object.keys(errors).length !== Object.keys(values).length 
    || values.password !== values.confirmation

    useEffect(() => {
        if (!success) {
            return
        }

       const timer = setTimeout(() => {
            window.history.replaceState(null , null , window.location.pathname)
            const login = steps.find(step => step.label === "Login")
            setSelectedStep(steps.indexOf(login))
        } , 6000)

        return () => clearTimeout(timer) 

    } , [success])

    return (
        <>
            <Grid item classes={{root : classes.icon}}>
                <img src={accountIcon} alt="reset passsword page" />
            </Grid>

            <Fields fields={fields} errors={errors} setErrors={setErrors} values={values} setValues={setValues} />

            <Grid item >
                <Button disabled={disabled} variant="contained" color="secondary" classes={{root : classes.reset}} onClick={handleReset}>
                    {loading ? <CircularProgress /> : (
                        <Typography variant="h5" classes={{root : classes.buttonText}}>
                         Reset Password
                     </Typography>
                    )}                  
                </Button>
            </Grid>

        </>
    )
}