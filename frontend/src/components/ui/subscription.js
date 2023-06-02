import React , {useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import QtyButton from '../product-list/QtyButton';
import { CartContext , FeedBackContext , UserContext} from '../../contexts';
import { setSnackbar , addToCart , toggleSubscription} from '../../contexts/actions';
import SubscriptionIcon from '../../images/Subscription';
import clsx from "clsx";
import {useMediaQuery} from '@material-ui/core';
import SelectFrequency from './select-frequency';

const useStyles = makeStyles(theme => ({
    iconWrapper : {
        height : ({ size }) => `${size || 2 }rem`,
        width : ({ size }) => `${size || 2 }rem`
    },
    row : {
        height : "4rem" ,
        padding : "0 0.5rem" , //0 for top and bottom , and 0.5 for left and right
        [theme.breakpoints.down("xs")] : {
            height : "auto"
        }
    },
    dark : {
        backgroundColor : theme.palette.secondary.main
    },
    light : {
        backgroundColor : theme.palette.primary.main
    },
    iconButton : {
        padding : ({ noPadding }) => (noPadding ? 0 : "undefined")
    },
    button : {
        height : "8rem" ,
        borderRadius : 0 ,
        width : "100%",
        [theme.breakpoints.down("xs")] : {
            height : "auto" // This will resize the button to always contain the contents within the button
        }
    },
    cartText : {
        color : "#fff" ,
        fontSize : "4rem",
        [theme.breakpoints.down("sm")] : {
            fontSize : "3rem"
        },
        [theme.breakpoints.down("xs")] : {
            fontSize : "2rem"
        }
    },
    dialog : {
        borderRadius : 0,
        backgroundColor : theme.palette.primary.main
    },
    buttonWrapper : {
        width : "100%"
    }
}))

export default function Subscription ({ size , stock , selectedVariant , variant , name , color , noPadding , isCart ,
                                    cartFrequency}) {
    const classes = useStyles({ size , noPadding });
    const [open ,setOpen] = useState(false)
    const [qty , setQty] = useState(1)
    const [frequency , setFrequency] = useState("Month")
    const {dispatchFeedback} = useContext(FeedBackContext)
    const { dispatchCart} = useContext(CartContext)
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

    const { user } = useContext(UserContext)

    const handleCart = () => {
        //Below we send the argument frequency for the subscription value
        dispatchCart(addToCart(variant , qty , name , stock[selectedVariant].qty , frequency ))
        setOpen(false)
        dispatchFeedback(setSnackbar({ status : "success" , message : "Subscription Added to Cart."}))
    }

    const handleOpen = () => {

        //The below block allows us to toggle subscription in the cart
        if (isCart) {
            dispatchCart(toggleSubscription(isCart.variant , cartFrequency))
            return
        }

        if (user.username === "Guest") {
            dispatchFeedback(setSnackbar({status : "error" , message : "You must be logged in to create a subscription"}))
            return
        } else {
            setOpen(true)
        }
    }

    return (
        <>
            <IconButton onClick={handleOpen} classes={{ root : classes.iconButton}}>
                <span className={classes.iconWrapper}>
                    <SubscriptionIcon color={color}/>
                </span>
            </IconButton>

            <Dialog fullWidth 
            maxWidth="md" 
            fullScreen={matchesXS}
            open={open} onClose={() => setOpen(false)} classes={{ paper : classes.dialog}}>
                <Grid container direction='column' alignItems='center'>
                    <Grid item container alignItems='center' justifyContent='space-between' classes={{root : clsx( classes.row , classes.dark)}}>
                        <Grid item>
                            <Typography variant='h4'>
                                Quantity
                            </Typography>
                        </Grid>

                        <Grid item>
                            <QtyButton 
                            stock={stock} 
                            override={{value : qty , setValue : setQty}}
                            selectedVariant={selectedVariant} 
                            white 
                            hideCartButton 
                            round/>
                        </Grid>    
                    </Grid>

                    <Grid item container alignItems={ matchesXS ? "flex-start" :  'center'} justifyContent='space-between' 
                    direction={matchesXS ? "column" : "row"}
                    classes={{root : clsx( classes.row , classes.light)}}>
                        <Grid item>
                            <Typography variant='h4'>
                                Deliver Every
                            </Typography>
                        </Grid>

                        {/* renderValue is used to display values using the chip
                         To change the icon that is displaying we use IconComponent to make custom menu icon
                         2. {.MuiSelect-select , here .MuiSelect is the compoenent and }
                         3. Inorder to style the menuItem compoenent within select we use MenuProps */}
                        <Grid item>
                            <SelectFrequency value={frequency} setValue={setFrequency}/>
                        </Grid>
                    </Grid>

                    <Grid item classes={{ root : classes.buttonWrapper}}>
                        <Button variant='contained' 
                        color='secondary' 
                        onClick={handleCart}
                        classes={{root : classes.button}}
                        disabled={qty === 0}>
                            <Typography variant='h1'classes={{root : classes.cartText}}>
                                Add Subscription To Cart
                            </Typography>
                        </Button>
                    </Grid>

                    {matchesXS && (
                    <Grid item> 
                        <Button onClick={() => setOpen(false)}>
                            <Typography variant ="body2">
                                Cancel
                            </Typography>
                        </Button>
                    </Grid>
                    )}

                </Grid>
            </Dialog>

        </>
    )
}