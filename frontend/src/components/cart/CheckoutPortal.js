import React , {useState , useEffect , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';

import Details from "../settings/Details";
import Location from "../settings/Location";
import Payments from "../settings/Payments";
import Confirmation from './Confirmation';
import validate from '../ui/validate';
import CheckoutNavigation from './CheckoutNavigation';
import Shipping from './Shipping';
import BillingConfirmation from './BillingConfirmation';
import ThankYou from './ThankYou';

import { CartContext } from '../../contexts';

const useStyles = makeStyles(theme => ({
    stepContainer : {
        width : "40rem" ,
        height : "25rem" ,
        backgroundColor : theme.palette.primary.main ,
        [theme.breakpoints.down("sm")] : {
            width : "100%"
        }
    },
    container : {
        [theme.breakpoints.down("md")] : {
            marginBottom : "5rem"
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

//THIS WILL SETUP STRIPE AND CONNECT IT TO OUR ACCOUNT WHICH WE HAVE CREATED BASED ON API KEY
const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PK) 

export default function CheckoutPortal ({ user }) {
    const classes = useStyles();
    //Checking for github repository
    //Here below we are checking the cart for any subscription
    const { cart } = useContext(CartContext)
    const hasSubscriptionCart = cart.some(item => item.subscription)
    // console.log("25" + JSON.stringify(user));
    // console.log("25 a " + JSON.stringify(user.subscriptions));
    // console.log("25 b " + JSON.stringify(user.subscriptions.length));
    const hasSubscriptionActive = user.subscriptions?.length > 0 

    const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

    const [selectedStep , setSelectedStep] = useState(0)

    const [detailValues , setDetailValues] = useState({ name : "" , email : "" , phone : ""})
    const [billingDetails , setBillingDetails] = useState({ name : "" , email : "" , phone : ""})

    const [detailSlot , setDetailSlot] = useState(0)
    const [detailForBilling , setDetailForBilling] = useState(false)

    const [locationValues , setLocationValues] = useState({street : "" , zip : "" , city : "" , state : ""})
    const [billingLocation , setBillingLocation] = useState({street : "" , zip : "" , city : "" , state : ""})
    
    const [locationSlot , setLocationSlot] = useState(0)
    const [locationForBilling , setLocationForBilling] = useState(false)

    const [card , setCard] = useState({ brand : "" , last4 : ""})

    const [errors , setErrors] = useState({})

    const [selectedShipping , setSelectedShipping] = useState(null)
    const shippingOptions = [{ label : "FREE SHIPPING" , price : 0} , 
                             {label : "2-DAY" , price : 80} , 
                             {label : "OVERNIGHT SHIPPING" , price : 150}]

    const [cardSlot , setCardSlot] = useState(0)  
    
    const [saveCard , setSaveCard] = useState(hasSubscriptionCart)

    const [order , setOrder] = useState(null)

    const [cardError , setCardError ]  = useState(true)
  
    const errorHelper = (values , forBilling , billingValues , slot) => {
        const valid = validate(values)

        let billingValid 
        //If we have one slot marked as billing
        if(forBilling !== false && forBilling !== undefined) {
            //...Validtate the billingValues
          const billingValid = validate(billingValues)

          //If we are currently on the same slot marked for billing i.e billling and shipping are the same
          if (forBilling === slot) {
            //..then we just need to validate the one set of values because 
            // they are the same
            return Object.keys(billingValid).some(value => !billingValid[value])
          } else {
            //Otherwise , if we are currently on a different slot then the slot marked for billing ,
            //i.e billing !== shipping ( billing and shipping are different) then we need to validate 
            //both the billing snd shipping values
            return (
             Object.keys(billingValid).some(value => !billingValid[value])  || 
             Object.keys(valid).some(value => !valid[value]))
          }


        } else {
            // if no slots ere marked for billing , just validte current slot 
             //return Object.keys(valid).some(value => valid[value] === false)
             return Object.keys(valid).some(value => !valid[value])
        }
       
    }

    console.log(errorHelper(detailValues));

    let steps = [
                    {
                        title : "Contact Info" ,
                        component : (
                        <Details 
                        user={user}
                        values={detailValues} 
                        setValues={setDetailValues} 
                        slot={detailSlot} 
                        setSlot={setDetailSlot}
                        errors={errors} 
                        setErrors={setErrors} 
                        billing={detailForBilling} 
                        setBilling={setDetailForBilling}
                        billingValues={billingDetails} 
                        setBillingValues={setBillingDetails} 
                        selectedStep={selectedStep}
                        checkout/> 
                        ) ,
                        hasActions : true , error : errorHelper(detailValues , detailForBilling , billingDetails , detailSlot) 
                    } , 

                     {
                        title : "Billing Info" ,
                        component : (
                            <Details 
                            values={billingDetails}
                            setValues={setBillingDetails}
                            errors={errors} 
                            setErrors={setErrors} 
                            selectedStep={selectedStep}
                            checkout 
                            noSlots/>
                        ),
                        error : errorHelper(billingDetails)
                     } ,

                    {
                         title : "Address" ,
                        component : (
                            <Location 
                            user={user} 
                            values={locationValues} 
                            setValues={setLocationValues} 
                            slot={locationSlot} 
                            setSlot={setLocationSlot}
                            billing={locationForBilling} 
                            setBilling={setLocationForBilling} 
                            errors={errors} 
                            setErrors={setErrors}
                            billingValues={billingLocation} 
                            setBillingValues={setBillingLocation} 
                            selectedStep={selectedStep}
                            checkout/>
                    ) ,
                     hasActions : true ,
                    error : errorHelper(locationValues , locationForBilling , billingLocation , locationSlot)
                    } ,

                     {
                        title : "Billing Address" ,
                        component : (
                            <Location 
                            values={billingLocation} 
                            setValues={setBillingLocation}
                            errors={errors} 
                            setErrors={setErrors} 
                            selectedStep={selectedStep}
                            checkout 
                            noSlots/>
                        ),
                        error : errorHelper(billingLocation)
                     } ,

                    { 
                    title : "Shipping" ,
                     component : (
                     <Shipping 
                     shippingOptions={shippingOptions} 
                     selectedShipping={selectedShipping}  
                     setSelectedShipping={setSelectedShipping}
                     selectedStep={selectedStep}/>
                    ) , 
                    error : selectedShipping === null
                    } , 

                    { 
                        title : "Payment" , 
                     component : (
                        <Payments 
                        slot={cardSlot} 
                        setSlot={setCardSlot} 
                        user={user} 
                        checkout 
                        saveCard={saveCard} 
                        setSaveCard={setSaveCard} 
                        setCardError={setCardError}
                        selectedStep={selectedStep} 
                        setCard={setCard}
                        hasSubscriptionCart={hasSubscriptionCart}
                        hasSubscriptionActive={hasSubscriptionActive}
                        />
                        ) , 
                    error : cardError
                    } , 

                    { 
                     title : "Confirmation" ,
                     component : (
                        <Confirmation 
                        detailValues={detailValues} 
                        user={user}
                        billingDetails={billingDetails} 
                        detailForBilling={detailForBilling} 
                        locationValues={locationValues}
                        billingLocation={billingLocation} 
                        locationForBilling={locationForBilling} 
                        shippingOptions={shippingOptions} 
                        selectedShipping={selectedShipping}  
                        selectedStep={selectedStep} 
                        setSelectedStep={setSelectedStep}
                        order={order} 
                        setOrder={setOrder}
                        saveCard={saveCard} 
                        card={card} 
                        cardSlot={cardSlot}/>
                        )
                    } , 

                    { title : `Thanks , ${user.username.split(" ")[0]} !` , 
                    component : <ThankYou 
                    selectedShipping={selectedShipping} 
                    order={order}
                    selectedStep={selectedStep}/>}
                ]

                //Here in this Filter method , all the steps will be added to array except Billing Info
                if (detailForBilling !== false) {
                    steps = steps.filter(step => step.title !== "Billing Info")
                }

                if (locationForBilling !== false) {
                    steps = steps.filter(step => step.title !== "Billing Address")
                }

            useEffect(() => {
                setErrors({})
            },[detailSlot , locationSlot , selectedStep])

    return (
        <Grid item container classes={{root : classes.container}}
            direction="column" alignItems={matchesMD ? "flex-start" : 'flex-end'} lg={6}>
            <CheckoutNavigation 
            steps={steps} 
            selectedStep={selectedStep} 
            setSelectedStep={setSelectedStep}
            details={detailValues} 
            detailSlot={detailSlot} 
            setDetails={setDetailValues} 
            location={locationValues} 
            locationSlot={locationSlot} 
            setLocation={setLocationValues} 
            setErrors={setErrors} />

            <Grid item container direction="column" alignItems='center' classes={{root : classes.stepContainer}}>
                <Elements stripe={stripePromise}>
                    {/* Since we have only reference of the component , to pass the new props to that component
                    we use React.clone() */}
                    {steps.map((step , i) => React.cloneElement(step.component , {
                        stepNumber : i , key : i
                    }))}
                </Elements>
            </Grid>

        {/* Below code if it is true then it renders BillingConfirmation section */}
        {steps[selectedStep].title === "Confirmation" && <BillingConfirmation 
        detailForBilling={detailForBilling} billingDetails={billingDetails} detailSlot={detailSlot}
        locationForBilling={locationForBilling} billingLocation={billingLocation} locationSlot={locationSlot}/>}

        </Grid>
        
    )
}