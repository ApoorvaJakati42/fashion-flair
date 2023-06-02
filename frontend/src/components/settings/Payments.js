import React , {useState , useEffect , useContext} from 'react';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import clsx from 'clsx';
import {CircularProgress} from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import cardIcon from '../../images/card.svg'
import Slots from './Slots';
import {FormControlLabel} from '@material-ui/core';
import {Switch} from '@material-ui/core';
import { CardElement, useStripe , useElements } from '@stripe/react-stripe-js';
import {useMediaQuery} from '@material-ui/core';

import { FeedBackContext , UserContext} from '../../contexts';
import { setSnackbar , setUser} from '../../contexts/actions';

const useStyles = makeStyles(theme => ({
    number : {
        color : "#fff",
        marginBottom : "5rem" ,
        [theme.breakpoints.down("xs")] : {
            marginBottom : ({checkout}) => checkout ? "1rem" : undefined,
            fontSize : ({checkout}) => checkout ? "1.5rem" : undefined
        }
    },
    removeCard : {
        backgroundColor : "#fff",
        paddingLeft : "5px" ,
        paddingRight : "5px",
        "&:hover" : {
            backgroundColor : "#fff"
        },
        marginLeft : "2rem",
        [theme.breakpoints.down("xs")] : {
            marginLeft : ({checkout}) => checkout ? 0 : undefined
        }
    },
    removeCardText : {
        fontSize : "1rem" ,
        color : theme.palette.primary.main ,
        fontFamily : "Philosopher" ,
        fontStyle : "italic"
    },
    icon : {
        marginBottom : "3rem",
        [theme.breakpoints.down("xs")] : {
            marginBottom : ({checkout}) => (checkout ? "3rem" : "1rem")
        }
    },
    slotContainer : {
         //absolute positioned element will appear on top of the component which is relative
        position : "absolute" ,
        bottom : 0
    },
    paymentContainer : {
        // default value of display is "flex" so it gives the style to grid
        display : ({checkout , selectedStep , stepNumber}) => 
        checkout && selectedStep !== stepNumber ? "none" : "flex" ,
        // relative position is like background and absolute positioned element appears on top of this element
        position : "relative" ,
        borderLeft : ({ checkout}) => checkout ? 0 : "4px solid #fff" ,
        height : "100%" ,
        [theme.breakpoints.down("md")] : {
            height : ({ checkout }) => !checkout ? "30rem" : "100%" ,
            borderLeft : 0
        }
    },
    switchWrapper : {
        marginRight : "4px"
    },
    switchLabel : {
        color : "#fff" ,
        fontWeight : 600 ,
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.25rem"
        }
    },
    form : {
        width : "75%",
        borderBottom : "2px solid #fff",
        height : "2rem" ,
        marginTop : "-1rem",
        [theme.breakpoints.down("xs")] : {
            width : "85%"
        }
    },
    spinner : {
        marginLeft : "3rem"
    },
    switchItem : {
        width : "100%"
    },
    numberWrapper : {
        marginBottom : "6rem"
    }
}))

export default function Payments ({ user , slot , setSlot , checkout , saveCard , setSaveCard , setCardError ,
            selectedStep , stepNumber , setCard , hasSubscriptionCart , hasSubscriptionActive}) {
    const classes = useStyles({ checkout , selectedStep , stepNumber});
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"));

    //These stripe hooks will work only if they are inside the Elements Provider
    const stripe = useStripe() 
    const elements = useElements() 

    const [loading , setLoading] = useState(false)
    
    const { dispatchFeedback} = useContext(FeedBackContext)
    const {dispatchUser} = useContext(UserContext)
   
    const card = user.username === "Guest" ? {last4 : "" , brand : ""} : user.paymentMethods[slot]

    const removeCard = () => {
        //Below line rules out any slots that are empty and gets any saved cards we have
        const remaining = user.paymentMethods.filter(method => method.last4 !== "")

        const subscriptionPayment = user.subscriptions.find(subscription => 
            subscription.paymentMethod.last4 === card.last4)

            //Below if check is used to check the last card remaining for payment or the card that is associated with subscription
        if ((hasSubscriptionActive && remaining.length === 1) || subscriptionPayment) {
            dispatchFeedback(setSnackbar({ status : "error" , 
            message : "You cannot remove your last card with an active subscription. Please add another card first."}))
            return
        }

        setLoading(true)
        axios.post(process.env.GATSBY_STRAPI_URL  + "/orders/removeCard" , {
            card : card.last4 
        } , {
            headers : { Authorization : `Bearer ${user.jwt}`}
        }).then(response => {
            setLoading(false)
            //We get back updated strapi user profile , so we update react context and remove the card ...
            //... and save the new profile in local storage
            dispatchUser(setUser({...response.data.user , jwt : user.jwt , onboarding : true}))            
            setCardError(true)
            setCard({brand : "" , last4 : ""})
        }).catch(error => {
            setLoading(false)
            console.error(error);

            dispatchFeedback(setSnackbar({ status : "error" , message :" There was error in removing the card. Please try again"}))
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }
    }

    const handleCardChange = async event => {
        if (event.complete) {
            console.log("Valid");
            setCardError(false)
            const cardElement = elements.getElement(CardElement) // Here from CardElement we get details entered in the input screen
            // Here for security purpose we cant get data entered in the input fields .So from createPaymentMethod we get...
            //...the last 4 digits and brand from this method to save it
            const {error , paymentMethod} = await stripe.createPaymentMethod({
                type : "card" , card : cardElement
            })
            setCard({ brand : paymentMethod.card.brand , last4 : paymentMethod.card.last4})
        }else {
            console.log("Invalid");
            setCardError(true)
        }
    }

    const cardWrapper = (
        <form onSubmit={handleSubmit} className={classes.form}>
            <CardElement options={{style : {
                base : {
                    fontSize : "20px" ,
                    fontFamily : "Montserrat" ,
                    color : "#fff" ,
                    iconColor : "#fff",
                    "::placeholder" : {
                        color : "#fff"
                    }
                }
                
            }}} onChange={handleCardChange} />
        </form>
    )

    //We want this effect to run when this component first loads
    //We will update navigation when we change the slot and also when component firstly loads to DOM
    useEffect(() => {
        //If this is not for checkout and not for guest
        if (!checkout || !user.jwt) {
            return
        }

        //paymentMethods will be empty if there are no saved cards and if it is not empty then ...
        //.. there is a saved card
        if (user.paymentMethods[slot].last4 !== "") {
            setCard(user.paymentMethods[slot])
            setCardError(false)
        } else {
            setCard({ brand : "" , last : ""})
            setCardError(true)
        }

    },[slot])

    return (
        <Grid item container direction="column" lg={ checkout ? 12 : 6} xs={12} alignItems="center" justify="center" 
        classes={{root : classes.paymentContainer}}>
            <Grid item>
                <img src={cardIcon} alt="payment card" className={classes.icon}/>
            </Grid>

            <Grid item container justify="center" classes={{ root : clsx({
                [classes.numberWrapper] : checkout && matchesXS //This class applies only if checkout and matchesXS is true
            })}}>
                { checkout && !card.last4 ? cardWrapper : null}
                <Grid item>
                    <Typography align="center" variant="h3" classes={{root : classes.number}}>
                        {card.last4 ? `${card.brand.toUpperCase()} **** **** **** ${card.last4}` :
                        checkout ? null : "Add a new card during checkout"} 
                    </Typography>
                </Grid>

                {card.last4 && (
                    <Grid item classes={{ root : clsx({
                        [classes.spinner] : loading
                    })}}>
                      { loading ? <CircularProgress color='secondary'/> : (
                        <Button variant="container" classes={{root : classes.removeCard}} onClick={removeCard}>
                            <Typography variant="h6" classes={{root : classes.removeCardText}}>
                                Remove Card
                            </Typography>
                        </Button>
                      )}  
                </Grid>
                )}
            </Grid>

            <Grid item container justify="space-between" classes={{root : classes.slotContainer}}>
                <Slots slot={slot} setSlot={setSlot} noLabel/>

                {checkout && user.username !== "Guest" &&  (
                     <Grid item classes={{ root : clsx({
                        [classes.switchItem] : matchesXS
                     })}}>
                        <FormControlLabel 
                        classes={{ root : classes.switchWrapper , label : classes.switchLabel}} 
                        label="Save Card For Future Use" 
                        labelPlacement="start"
                        control={
                            <Switch 
                            disabled={user.paymentMethods[slot].last4 !== "" || hasSubscriptionCart }
                            checked={user.paymentMethods[slot].last4 !== "" || hasSubscriptionCart ? true : saveCard} 
                            onChange={() => setSaveCard(!saveCard)}
                            color="secondary"/>
                            } />
                     </Grid>
                )}

            </Grid>
        </Grid>
    )
}