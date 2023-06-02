import React , {useState} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import complete from "../../images/order-placed.svg"
import { Link } from "gatsby";
import {useMediaQuery} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    detailsButton : {
        padding : "0.25rem 0" , //0.25rem for top and bottom , 0 for left and right 
        textTransform : "none"
    } ,
    order : {
        fontWeight : 600 ,
        [theme.breakpoints.down("xs")] : {
            fontSize : "1rem"
        }
    },
    detailsText : {
        [theme.breakpoints.down("xs")] : {
            fontSize : "1rem" 
        }
    },
    shopText : {
        fontSize : "2rem" ,
        fontWeight : 600 ,
        textTransform : "none",
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.5rem"
        }
    },
    container : {
        height : "100%" , //This will take up the full height available 
        position : "relative" ,
        display : ({ selectedStep , stepNumber}) =>  selectedStep !== stepNumber ? "none" : "flex"  // This is the parent element 
    },
    shopWrapper : {
        //absolute meaning is that this item will be diminished in any way or i.e this item will 
        //not be in relation with other items or this item is independant 
        //This shopWrapper will stay inside the container which is kept as position as relative
        position : "absolute" ,
        bottom : "1rem" ,
        right : "1rem"
    },
    icon : {
        marginTop : "-3rem"
    }
}))

export default function ThankYou ({selectedShipping , order , selectedStep , stepNumber }) {
    const classes = useStyles({ selectedStep , stepNumber});
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

    const addToDate = days => {
        var date = new Date()
        date.setDate(date.getDate() + days)
        const day = date.getDate()
        const month = date.getMonth() + 1 //Here January is 0th month so we are adding +1
        const year = date.getFullYear()

        return `${day}/${month}/${year}`
    }

    const getExpected = () => {
        switch(selectedShipping) {
            case "2-DAY-SHIPPING" : 
            return addToDate(2)

            case "OVERNIGHT SHIPPING" : 
            return addToDate(1)

            default : 
            return addToDate(14)
        }
    }

    return (
        //alignItems will set the content horizontally , justify will set the content vertically
        <Grid item container direction="column" alignItems='center' justify="center" classes={{root : classes.container}}>
            <Grid item>
                <img src={complete} alt="order placed" className={classes.icon}/> 
            </Grid>

            <Grid item>
                <Typography variant="h4" align="center">
                    Expected by {getExpected()}
                </Typography>

                {/* Container property should take 1005 width of the parent element */}
            <Grid item container justify={ matchesXS ? "space-around" : "space-between"} alignItems='center'> 
                <Grid item >
                    <Typography variant="body2" classes={{root : classes.order}}>
                    {/* ? after order prop indicates if the order exists then it will go and check the id
                    This ? is called optional chaining operator */}
                        Order #{order?.id.slice(order.id.length - 10 , order.id.length)}
                    </Typography>
                </Grid>
                <Grid item >
                    <Button classes={{root : classes.detailsButton}}>
                        <Typography variant="body2" classes={{root : classes.detailsText}}>
                            Details > 
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
            </Grid>

        
            <Grid item classes={{root : classes.shopWrapper}}>
                <Button component={Link} to="/hats">
                    <Typography variant="body2" classes={{root : classes.shopText}}>
                        Shop >
                    </Typography>
                </Button>
            </Grid>

        </Grid>
    )
}