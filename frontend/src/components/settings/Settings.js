import React , {useState , useContext , useEffect} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Details from './Details';
import Payments from './Payments';
import Location from './Location';
import Edit from './Edit';
import clsx from 'clsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { UserContext } from '../../contexts';

const useStyles = makeStyles(theme => ({
    bottomRow : {
        borderTop : "4px solid #fff"
    },
    sectionContainer : {
        height : "50%"
    }
}))

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PK)

export default function Settings ({ setSelectedSetting }) {
    const classes = useStyles();

    const hasSubscriptionActive = user.subscriptions.length > 0 

    const { user  , dispatchUser} = useContext(UserContext)
    const [edit , setEdit] = useState(false)
    const [changesMade , setChangesMade] = useState(false)

    const [detailValues , setDetailValues] = useState({ name : "" , phone : '' , password : "********"})

    const [detailSlot , setDetailSlot] = useState(0)
    const [detailErrors , setDetailErrors] = useState({})

    const [locationValues , setLocationValues] = useState({
        street : "" , zip : "" , city : "" , state : ""
    })
    

    const [locationSlot , setLocationSlot] = useState(0)

    const [locationErrors , setLocationErrors] = useState({})

    const allErrors = {...detailErrors , ...locationErrors};
    const isError = Object.keys(allErrors).some(error => allErrors[error] === true)

    const [billingSlot , setBillingSlot] = useState(0)

    console.log("isError " + isError);

    useEffect(() => {
        setDetailErrors({})
    },[detailSlot])

    useEffect(() => {
        setLocationErrors({})
    },[locationSlot])

    return (
        <>
        <Grid container classes={{root : classes.sectionContainer}}>
            <Details user={user} edit={edit} setChangesMade={setChangesMade} 
            values={detailValues} setValues={setDetailValues}
            slot={detailSlot} setSlot={setDetailSlot}
            errors={detailErrors} setErrors={setDetailErrors}/>
            
            <Elements stripe={stripePromise}>
                <Payments user={user} edit={edit} slot={billingSlot} setSlot={setBillingSlot}
                hasSubscriptionActive={hasSubscriptionActive}/>
            </Elements>
            
        </Grid>
        <Grid container classes={{root : clsx(classes.bottomRow ,classes.sectionContainer )}}>
            <Location user={user} edit={edit} setChangesMade={setChangesMade} 
            values={locationValues} setValues={setLocationValues}
            slot={locationSlot} setSlot={setLocationSlot}
            errors={locationErrors} setErrors={setLocationErrors}/>

            <Edit 
            user={user} 
            dispatchUser={dispatchUser}
            setSelectedSetting={setSelectedSetting} 
            edit={edit} setEdit={setEdit} 
            changesMade={changesMade}
            details={detailValues}
            locations={locationValues}
            detailSlot={detailSlot}
            locationSlot={locationSlot}
            isError={isError}/>
        </Grid>
    </>
    )
}