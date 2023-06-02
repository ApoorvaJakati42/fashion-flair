import React  from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {SwipeableDrawer} from '@material-ui/core';
import {Chip} from '@material-ui/core';
import clsx from "clsx";
import OrderDetailItem from './OrderDetailItem';
import {Button} from '@material-ui/core';
import {useMediaQuery} from '@material-ui/core';

import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles(theme => ({
    drawer : {
        height : "100%" ,
        width : "30rem" ,
        backgroundColor : "transparent",
        [theme.breakpoints.down("xs")] : {
            width : "100%"
        }
    },
    id : {
        fontSize : "2.5rem" ,
        fontWeight : 600 ,
        marginTop : "1rem",
        marginLeft : "1rem"
    },
    bold : {
        fontWeight : 600
    },
    date : {
        fontWeight : 600 ,
        marginLeft : "1rem",
        marginBottom : "1rem"
    },
    padding : {
        padding : "1rem"
    },
    status : {
        marginLeft : "1rem"
    },
    dark : {
        backgroundColor : theme.palette.secondary.main
    },
    light : {
        backgroundColor : theme.palette.primary.main
    },
    prices : {
        padding : "0.5rem 1rem"
    },
    text : {
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.25rem"
        }
    },
    spacer : {
        minHeight : "10rem" //If the grid item is empty then height property is ignored, but if given minHeight then it still stays
    }
}))

export default function OrderDetails ({ orders , open , setOpen}) {
    const classes = useStyles();

    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

    const order = orders.find(order => order.id === open)

    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

    const prices = [
                 {label : "SubTotal" , value : order?.subTotal} ,
                 {label : "Shipping" , value : order?.shippingOption.price},
                 {label : "Tax" , value : order?.tax},
                 {label : "Total" , value : order?.total},
                 {label : "Payment" , string : `${order?.paymentMethod.brand.toUpperCase()}
                  ${order?.paymentMethod.last4}`},
                  {label : "Transaction" , string : order?.transaction}
                ]

    return (
        //If open is null the drawer will be closed or else if open has a id ,then it is set to true and drawer will be opened
        // !! indicates that if open is null then first ! mark tells it is not null and other ! mark tells it is false...
        //... this !! makes converts null value to actual true or false

        //1. anchor prop is given so the drawer comes from right side
        //2. In order to improve performance we used ios and related properties
        <SwipeableDrawer 
            open={!!open} 
            onOpen={() => null} 
            onClose={() => setOpen(null)}
            anchor={matchesXS ? "bottom" : "right"}
            classes={{ paper : classes.drawer}}
            disableBackdropTransition={!iOS} 
            disableDiscovery={iOS} >

                {/* Here we give Button component to Grid so , the grid takes all the properties of the button */}
                {/* Hidden component will hide the contents within it , only after specifying the breakpoint */}
                <Hidden smUp>
                    <Grid item 
                    classes={{root : classes.spacer}} 
                    component={Button} 
                    disableRipple
                    onClick={() => setOpen(null)}/> 
                </Hidden>

                <Grid container direction="column" classes={{root : classes.light}}>
                    <Grid item classes={{root : classes.dark}}>
                        <Typography variant="h2" classes={{root : classes.id}}>
                            Order #{order?.id.slice(order.id.length-10 , order.id.length).toUpperCase()}
                        </Typography>
                    </Grid>

                    <Grid item container classes={{root : classes.dark}}>
                        <Grid item classes={{root : classes.status}}>
                            <Chip label={order?.status} classes={{label : classes.bold , root : classes.light}}/>
                        </Grid>

                        <Grid item>
                            <Typography variant="body2" classes={{root : classes.date}}>
                                {`${order?.createdAt.split("-")[2].split("T")[0]}/${order?.createdAt.split("-")[1]}/${order?.createdAt.split("-")[0]}`}
                            </Typography>
                        </Grid>                    
                    </Grid>

                    <Grid item classes={{root : classes.padding}}>
                            <Typography variant="body2" classes={{root : classes.bold}}>
                                Billing
                            </Typography>
                            <Typography variant="body2" classes={{root : classes.text}}>
                                {order?.billingInfo.name}
                                <br />
                                {order?.billingInfo.email}
                                <br />
                                {order?.billingInfo.phone}
                                <br />
                                <br />
                                {order?.billingAddress.street}
                                <br />
                                {order?.billingAddress.city} , {order?.billingAddress.state} 
                                {order?.billingAddress.zip}
                            </Typography>
                    </Grid>

                    <Grid item classes={{root : clsx(classes.dark , classes.padding)}}>
                            <Typography variant="body2" classes={{root : classes.bold}}>
                                Shipping
                            </Typography>
                            <Typography variant="body2" classes={{root : classes.text}}>
                                {order?.shippingInfo.name}
                                <br />
                                {order?.shippingInfo.email}
                                <br />
                                {order?.shippingInfo.phone}
                                <br />
                                <br />
                                {order?.shippingAddress.street}
                                <br />
                                {order?.shippingAddress.city} , {order?.shippingAddress.state} 
                                {order?.shippingAddress.zip}
                            </Typography>
                    </Grid>

                    {prices.map(price => (
                        <Grid item key={price.label} container justify="space-between" classes={{root : classes.prices}}>
                            <Grid item>
                                <Typography variant="body2" classes={{root : classes.bold}}>
                                    {price.label}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {price.string ? (
                                    <Typography variant="body2" classes={{root : classes.text}}>{price.string}</Typography>
                                ) : (
                                    <Chip label={`Rs. ${price.value?.toFixed(2)}`} classes={{label : classes.bold}} />
                                )}                               
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item classes={{root : clsx(classes.dark , classes.padding)}}>
                        <Typography variant="body2" gutterBottom classes={{root : classes.bold}}>
                            Items
                        </Typography>
                        {order?.items.map(item => <OrderDetailItem item={item} key={item.variant.id} />)}
                    </Grid>
                 

                </Grid>
        </SwipeableDrawer>
    )
}