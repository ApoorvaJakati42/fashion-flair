import React , {useState , useEffect} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

import clsx from 'clsx';

import accountIcon from '../../images/account.svg';
import EmailAdornment from '../../images/EmailAdornment';
import PasswordAdornment from '../../images/passwordAdornment';
import HidePasswordIcon from '../../images/HidePassword';
import ShowPasswordIcon from '../../images/showPassword';
import addUserIcon from '../../images/add-user.svg';
import forgotPassword from '../../images/forgot.svg';
import close from '../../images/close.svg';

import Fields from './Fields';

import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

import { setUser } from '../../contexts/actions';
import { setSnackbar } from '../../contexts/actions';

const useStyles = makeStyles(theme => ({
    accountIcon : {
        marginTop : "2rem"
    },
    
    login : {
        width : "20rem" ,
        borderRadius : 50 ,
        textTransform : "none",
        [theme.breakpoints.down("xs")] : {
            width : "15rem"
        }
    },
    faceBookButton : {
        marginTop : "-1rem"
    },
    faceBookText : {
        fontSize : "1.5rem" ,
        fontWeight : 600 ,
        textTransform : "none"
    },
    passwordError : {
        marginTop : 0
    },
    close : {
        paddingTop : 5
    },
    reset : {
        marginTop : "-4rem"
    },
    buttonText : {
        [theme.breakpoints.down("xs")] : {
             fontSize : "1.5rem"
        }
    }
}))

    export const EmailPassword = ( hideEmail , hidePassword , visible , setVisible , isWhite) => (
        {
            email : {
                helperText : "Invalid Email",
                placeholder : "Email",
                type : "text" ,
                hidden : hideEmail ,
                startAdornment : (
                    <span style={{ height : 17, width : 22 , marginBottom : "10px"}}>
                           <EmailAdornment color={isWhite ? "#fff" : null}/> 
                    </span> 
                )
            },
            password : {
                helperText : "Your password must be atleast 8 characters and include one uppercase letter, one number , one special character",
                placeholder : "Password",
                type : visible ? "text": "password" ,
                hidden : hidePassword ,
                startAdornment : <PasswordAdornment color={isWhite ? "#fff" : null}/>,
                endAdornment : (
                        <IconButton style={{padding : 0}} onClick={() => setVisible(!visible)}> 
                            {visible ? 
                                <ShowPasswordIcon color={isWhite ? "#fff" : null} /> : 
                                <HidePasswordIcon color={isWhite ? "#fff" : null}/>}        
                        </IconButton>)
            }
        }
    )

export default function Login ({steps , setSelectedStep , user , dispatchUser , dispatchFeedback}) {
    const classes = useStyles();

    
    const [values , setValues] = useState({
        email : "",
        password : ""
    })
    const [errors , setErrors] = useState({})
    const [visible , setVisible] = useState(false);
    const [forgot , setForgot] = useState(false);
    const [loading , setLoading] = useState(false);
    const [success , setSuccess] = useState(false)


    const fields = EmailPassword(false , forgot , visible , setVisible)

    const navigateSignUp = () => {
        const signUp = steps.find(step => step.label === "SignUp")

        setSelectedStep(steps.indexOf(signUp))
    }

    const handleLogin = () => {
        setLoading(true);
        axios.post(process.env.GATSBY_STRAPI_URL + "/auth/local" , {
            identifier : values.email ,
            password : values.password
        }).then(response => {
            console.log("User Profile" , response.data.user);
            console.log("jwt" , response.data.jwt);
            setLoading(false)
            setSuccess(true)

            dispatchUser(setUser({...response.data.user , jwt : response.data.jwt , onboarding : true}))
        }).catch(error => {
            const { message } = error.response.data.message[0].messages[0]
            setLoading(false)
            console.error(error)
            dispatchFeedback(setSnackbar({status : "error" , message }))
        })
    }

    const handleForgot = () => {
        setLoading(true);

        axios.post(process.env.GATSBY_STRAPI_URL + "/auth/forgot-password" , {
            email : values.email
        }).then(response => {
            setLoading(false);

            dispatchFeedback(setSnackbar({status : "success" , message : "Reset Code Sent"}))

            
        }).catch(error => {
            const { message } = error.response.data.message[0].messages[0]
            setLoading(false)
            console.error(error)
            dispatchFeedback(setSnackbar({status : "error" , message }))
        })
    }

   
    console.log("Login" , user);

    const disabled = Object.keys(errors).some(error => errors[error] === true)
                        || Object.keys(errors).length !== Object.keys(values).length

      useEffect(() => {
          if (!success) {
              return
          }

         const timer = setTimeout(() => {
            setForgot(false);
         } , 6000)

         return () => clearTimeout(timer)

      } , [success])                  

    return (
        <>
            <Grid item classes={{root : classes.accountIcon}}>
                <img src={accountIcon} alt="login page" />
            </Grid>

                <Fields fields={fields} errors={errors} setErrors={setErrors} values={values} setValues={setValues}/>
            
             <Grid item>
                 <Button variant="contained" color="secondary" 
                 onClick={() => forgot ? handleForgot() : handleLogin()}
                 disabled={loading || !forgot && disabled} //If disabled is true and we are not on forgot page
                 classes={{root : clsx(classes.login , {
                     [classes.reset] : forgot
                 })}}>
                     {loading ? <CircularProgress/> : (
                         <Typography variant="h5" classes={{root : classes.buttonText}}>
                         {forgot ? "Forgot Password" : "Login"}
                        </Typography>
                     )}                   
                 </Button>
             </Grid>

             {forgot ? null : (
                     <Grid item>
                     <Button component="a" href={`${process.env.GATSBY_STRAPI_URL}/connect/facebook`} classes={{root : clsx(classes.faceBookButton , {
                         [classes.passwordError] : errors.password
                     })}}>
                        <Typography variant="h3" classes={{root : classes.faceBookText}}>
                            Login With FaceBook
                        </Typography>
                     </Button>
                 </Grid>
             )}


             <Grid item container justify="space-between">
               <Grid item>
                   <IconButton onClick={navigateSignUp}>
                       <img src={addUserIcon} alt="sign up" />
                   </IconButton>
               </Grid>
               <Grid item classes={{root : clsx({
                   [classes.close] : forgot
               })}}>
                   <IconButton onClick={() => setForgot(!forgot)}>
                       <img src={forgot ? close : forgotPassword} 
                       alt={forgot ? "Back To Login" : "forgot password"} />
                   </IconButton>
               </Grid>
             </Grid>
        </>
    )
}