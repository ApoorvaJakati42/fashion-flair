import React , {useState , useEffect , useRef} from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import fingerprint from "../../images/fingerprint.svg"
import Fields from "../auth/Fields";
import { EmailPassword } from "../auth/Login";
import NameAdornment from '../../images/nameAdornment'
import PhoneAdornment from '../../images/PhoneAdornment'
import Slots from './Slots';
import { useMediaQuery } from '@material-ui/core';
import clsx from "clsx";
import {FormControlLabel} from '@material-ui/core';
import {Switch} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    phoneAdornment : {
        height : 25.122 ,
        width : 25.173
    },
    visibleIcon : {
        padding : 0
    },
    emailAdornment : {
        height : 17 ,
        width : 22 ,
        marginBottom : 10
    },
    icon : {
        marginTop : ({checkout}) => checkout ? "-2rem" : undefined ,
        marginBottom : ({checkout}) => checkout ? "1rem" : "3rem",
        [theme.breakpoints.down("xs")] : {
            marginBottom : "1rem"
        } 
    },
    fieldContainer : { 
        
        //     > this is the child selector
        marginBottom : "2rem" ,
        "& > :not(:first-child)" : {
            marginLeft : "5rem"
        },
        [theme.breakpoints.down("xs")] : {
            marginBottom : "1rem" ,
            "& > :not(:first-child)" : {
                marginLeft : 0 ,
                marginTop : "1rem"
            }
        }
    },
    "@global" : {
        ".MuiInput-underline:before , .MuiInput-underline:hover:not(.Mui-disabled):before" : {
            borderBottom : "2px solid #fff"    
        },
        ".MuiInput-underline:after" : {
          borderBottom : `2px solid ${theme.palette.secondary.main}`
        }
      }  ,
      slotContainer : {
           //absolute positioned element will appear on top of the component which is relative
          position : "absolute" ,
          bottom : ({checkout}) => checkout ? -8 : 0
      },
      detailsContainer : {
          // default value of display is "flex" so it gives the style to grid
          display : ({checkout , selectedStep , stepNumber}) => 
          checkout && selectedStep !== stepNumber ? "none" : "flex" ,
          // relative position is like background and absolute positioned element appears on top of this element
          position : "relative",
          height : "100%" ,
          [theme.breakpoints.down("md")] : {
              borderBottom : "4px solid #fff",
              height : ({ checkout }) => !checkout ? "30rem" : "100%" 
          }
      },
      fieldContainerCart : {
        "& > *" : {
            marginBottom : "1rem"
        }
      },
      switchWrapper : {
        marginRight : "4px"
      },
      switchLabel : {
        color : "#fff" ,
        fontWeight : 600 ,
        [theme.breakpoints.down("xs")] : {
            fontSize : "1rem"
        }
      }

}))

export default function Details ({ user , edit , setChangesMade , values , setValues ,
                             slot , setSlot , errors , setErrors , checkout , billing , setBilling , noSlots ,
                             billingValues , setBillingValues , selectedStep , stepNumber}) {
    const classes = useStyles({ checkout , selectedStep , stepNumber});

    const isMounted = useRef(false)

    const [visible , setVisible ] = useState(false)
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))
    
    const email_password = EmailPassword( false , false , visible , setVisible , true)
    const name_phone = {
        name : {
            helperText : "You must enter a name" ,
            placeholder : "Name" ,
            startAdornment : <NameAdornment color="#fff" />
        } ,
        phone : {
            helperText : "Invalid Phone number" ,
            placeholder : "Phone" ,
            startAdornment : (
                <div className={classes.phoneAdornment}>
                    <PhoneAdornment />
                </div>
            )
        }
    }

    useEffect(() => {

        if(noSlots || user.username === "Guest") return 

        if (checkout) {
           setValues(user.contactInfo[slot]) 
        } else {
            setValues({ ...user.contactInfo[slot] , password : "********"})
        }
    } , [slot])

    useEffect(() => {
        if (checkout) {
            return
        }
        const changed = Object.keys(user.contactInfo[slot]).some(field => 
            values[field] !== user.contactInfo[slot][field])

            setChangesMade(changed)
            
    },[values])

    useEffect(() => {
        if (noSlots)  {
            isMounted.current = false
            return 
        }

        //This below piece of code skips the first render of the component
        if (isMounted.current === false ) {
            isMounted.current = true
            return
        }

        if (billing === false && isMounted.current ) {
            setValues(billingValues)
        } 
        else {
            setBillingValues(values)
        }
    }, [billing])

    let fields = [name_phone , email_password]

    if (checkout) {
        fields = [{ name : name_phone.name ,
                    email : email_password.email ,
                    phone : name_phone.phone}]
    }

    const handleValues = values => {
        if (billing === slot && !noSlots) {
            setBillingValues(values)
        }
        setValues(values)
    }

    return (
        <Grid item container direction="column" lg={ checkout ? 12 : 6} xs={12} 
        alignItems="center" justify="center" classes={{root : classes.detailsContainer}}>
            <Grid item>
                <img src={fingerprint} alt="fingerprint" className={classes.icon}/>
            </Grid>

            {fields.map((pair , i) => (
                <Grid container justify="center" key={i} 
                alignItems={matchesXS || checkout ? "center" : undefined}
                direction={matchesXS || checkout ? "column" : "row"} 
                classes={{root : clsx({
                    [classes.fieldContainerCart] : checkout ,
                    [classes.fieldContainer] : !checkout
                })}}>
                <Fields 
                    fields={pair} 
                    values={billing === slot && !noSlots ? billingValues : values} 
                    setValues={handleValues} 
                    errors={errors}
                    setErrors={setErrors} 
                    isWhite
                    disabled={ checkout ? false : !edit}
                    settings={!checkout}/>
                </Grid>
            ))}

            {noSlots ? null : (
                <Grid item container justify={checkout ? "space-between" : undefined } classes={{root : classes.slotContainer}}>
                    <Slots slot={slot} setSlot={setSlot} checkout={checkout}/>
                    {checkout && (
                        <Grid item>
                            <FormControlLabel classes={{ root : classes.switchWrapper , label : classes.switchLabel}} 
                            label="Billing" labelPlacement="start"
                            control={
                            <Switch checked={billing === slot } 
                            onChange={() => setBilling(billing === slot ? false : slot)}
                            color="secondary"/>} />
                        </Grid>
                        )}
               </Grid>
            )}


        </Grid>
    )
}