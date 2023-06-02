import React,{useState} from "react"
import { Grid } from "@material-ui/core"
import { Link } from "gatsby"
import { Typography } from "@material-ui/core"
import { makeStyles , useTheme} from "@material-ui/core/styles"
import { Button } from "@material-ui/core"
import address from '../images/address.svg'
import Email from '../images/EmailAdornment'
import send from '../images/send.svg';
import clsx from "clsx";
import { TextField } from "@material-ui/core"
import { InputAdornment } from "@material-ui/core"

import Layout from "../components/ui/layout"
import validate from "../components/ui/validate"

import nameAdornment from '../images/name-adornment.svg';
import PhoneAdornment from '../images/PhoneAdornment';
import { useMediaQuery } from "@material-ui/core"


const useStyles = makeStyles(theme => ({
      mainContainer : {
        height : "45rem" ,
        backgroundColor : theme.palette.primary.main,
        marginBottom : "10rem",
        [theme.breakpoints.down("md")] : {
            marginTop : "8rem",
            height : "90rem"
        }
      },
      formContainer : {
        height : "100%"
      },
      formWrapper : {
        height : "100%",
        [theme.breakpoints.down("md")] : {
          height : "50%",
          marginTop : "-8rem"
         },
         [theme.breakpoints.down("xs")] : {
          width : "100%"
      }
      },
      blockContainer : {
        backgroundColor : theme.palette.secondary.main,
        height : "8rem" ,
        width : "40rem" ,
        display : "flex" ,
        justifyContent : "center" ,
        alignItems : "center",
        [theme.breakpoints.down("sm")] : {
          width : "30rem"
        },
        [theme.breakpoints.down("xs")] : {
          width : "100%"
      }
      },
      titleContainer : {
        marginTop : "-4rem"
      },
      buttonContainer : {
        marginBottom : "-4rem",
        textTransform : "none" ,
        borderRadius : 0 ,
        "&:hover" : {
          backgroundColor : theme.palette.secondary.light
        }
      },
      sendIcon : {
        marginLeft : "2rem"
      },
      contactInfo : {
        fontSize : "1.5rem",
        marginLeft : "2rem"
      },
      contactIcon : {
        height : "3rem" ,
        width : "3rem" 
      },
      contactEmailIcon : {
        height : "2.25rem",
        width : "3rem" 
      },
      infoContainer : {
        height : "21.25rem",
        [theme.breakpoints.down("xs")] : {
          height : "15.25rem" 
      }
      },
      middleInfo : {
        borderTop : "2px solid #fff" ,
        borderBottom : "2px solid #fff" ,
       // padding : "1rem 0" //1rem top and bottom , 0 To left and right
      },
      iconContainer : {
        borderRight : "2px solid #fff" ,
        height : "7rem" ,
        width : "8rem" ,
        display : "flex" ,  //These are used to make items center within the grid
        justifyContent : "center" ,  //These are used to make items center within the grid
        alignItems : "center", //These are used to make items center within the grid
        [theme.breakpoints.down("xs")] : {
          height : "5rem" ,
          width : "6rem"
      }
      },
      textField : {
        width : "30rem" ,
        [theme.breakpoints.down("sm")] : {
          width : "20rem"
         }
      },
      input : {
        color : "#fff"
      },
      fieldContainer : {
        marginBottom : "1rem"
      },
      multilineContainer : {
        marginTop : "1rem"
      },
      emailAdornment : {
        height : 17 ,
        width : 22 ,
        marginBottom : "10px"
      },
      phoneAdornment : {
        width : "25.173" ,
        height : "25.122"
      },
      multiline : {
          border : "2px solid #fff" ,
          borderRadius : 10,
          padding : "1rem"
      },
      multilineError : {
        border : `2px solid ${theme.palette.error.main}`
      },
      buttonDisabled : {
        backgroundColor : theme.palette.grey[500]
      },
      sendMessage : {
        [theme.breakpoints.down("xs")] : {
          fontSize : "2.5rem"
         }
      },
      "@global" : {
        ".MuiInput-underline:before , .MuiInput-underline:hover:not(.Mui-disabled):before" : {
            borderBottom : "2px solid #fff"    
        },
        ".MuiInput-underline:after" : {
          borderBottom : `2px solid ${theme.palette.secondary.main}`
        }
      }
}))

    const ContactPage = () => { 
      
      const classes = useStyles();
      const theme = useTheme();

      const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"));
      const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"));

      const [values , setValues] = useState({name : "" , email : "" , phone : "" , message : ""})

      const [errors , setErrors] = useState({})

      const fields = {
        name : {
           helperText : "You must enter a name" ,
           placeholder : "Name" ,
           adornment :  <img src={nameAdornment} alt="name"/>
        },
        email : {
           helperText : "Invalid Email",
           placeholder : "Email" ,
           adornment : ( <div className={classes.emailAdornment}>
                       <Email color={theme.palette.secondary.main}/>
                       </div>)
        },
        phone : {
           helperText : "Invalid phone number",
           placeholder : "Phone Number" ,
           adornment : (<div className={classes.phoneAdornment}>
                       <PhoneAdornment color={theme.palette.secondary.main}/>
                       </div> )
        },
        message : {
           helperText : "You must enter a message",
           placeholder : "Message" ,
           inputClasses : {
                     multiline : classes.multiline ,
                     error : classes.multilineError
                 }
        }
      }

      const info = [
        {label : <span>646 , Vithobha Nivas {matchesXS ? <br/> : null} , KA - 560057</span>  , 
        icon : (<img src={address} alt="address" className={classes.contactIcon}/>)} ,

        {label : "(080) 283745466", 
        icon : (<div className={classes.contactIcon}>
               <PhoneAdornment />
               </div> )} ,

        {label : "apoorva@varx.com",
         icon : (<div className={classes.contactEmailIcon}>
               <Email color="#fff" />
               </div> )}       
      ]

      const disabled = Object.keys(errors).some(error => errors[error] === true) || Object.keys(errors).length !== 4
 
    return (
    <Layout>
      <Grid container justify="space-around" direction={matchesMD ? "column" : "row"}
      alignItems="center" 
      classes={{root : classes.mainContainer}}>
        <Grid item classes={{root : classes.formWrapper}}>
          <Grid container direction="column" justify="space-between" alignItems="center" classes={{root : classes.formContainer}}>
            <Grid item classes={{root : clsx(classes.blockContainer , classes.titleContainer)}}>
              <Typography variant="h4" >
                Contact Us
              </Typography>
            </Grid>

            <Grid item>
              <Grid container direction="column">

                {Object.keys(fields).map(field => {

                  const validateHelper = (event) => {
                    return validate({[field] : event.target.value})
                  }

                  return (
                        <Grid key={field} item classes={{root : field === "message" ? classes.multilineContainer : classes.fieldContainer}}>
                        <TextField placeholder="Name" 
                        classes={{root : classes.textField}}
                        multiline={field === "message"}
                        rows={field === "message" ? 8 : undefined}
                        value={values[field]}
                        onChange={(e) =>{ 
                          const valid = validateHelper(e)  
     
                         if (errors[field] || valid[field] === true) {
                             setErrors({...errors , [field] : !valid[field]})
                         }
                         setValues({...values , [field] : e.target.value})
                         }}
                         onBlur={e => {
                          const valid = validateHelper(e)
                          setErrors({...errors , [field] : !valid[field]})
                        }}
                        error={errors[field]}
                        helperText={errors[field] && fields[field].helperText} //shorthand of true/false expression
                        placeholder={fields[field].placeholder}
                        InputProps={{
                        classes : {input : classes.input ,
                           ...fields[field].inputClasses} ,
                           disableUnderLine : field === "message" ,
                        startAdornment : field === "messsage" ? undefined : (
                          <InputAdornment position="start">
                            {fields[field].adornment}
                          </InputAdornment>
                        ) }}/>
                      </Grid>
                  )
                })}

              </Grid>
            </Grid>

            <Grid item component={Button} 
                disabled={disabled}
                classes={{
                  root : clsx(classes.blockContainer , classes.buttonContainer , {
                    [classes.buttonDisabled] : disabled
                  })
                  }}>
                  <Typography variant="h4" classes={{root : classes.sendMessage}}>
                    Send Message
                  </Typography>
                  <img src={send} alt="send message" className={classes.sendIcon}/>
            </Grid>
          </Grid>
        </Grid>

                  {/* ContactInfo Section Start */}
        <Grid item>
            <Grid container direction="column" justify="space-between" classes={{root : classes.infoContainer}} justify="space-between">

                  {info.map((section , i) => (
                        <Grid item key={section.label} container alignItems="center" classes={{root : i === 1 ? classes.middleInfo : undefined }}>
                             <Grid item classes={{root : classes.iconContainer}}>
                               {section.icon}                       
                             </Grid>
                             <Grid item >
                               <Typography variant="h2" classes={{root : classes.contactInfo}}>
                                 {section.label}
                               </Typography>
                             </Grid>
                       </Grid>
                  ))}
         
            </Grid>
        </Grid>
      </Grid>
    </Layout>
    )}

export default ContactPage
