import React , {useState , useEffect , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ButtonGroup } from '@material-ui/core';
import Cart from '../../images/cart.js';
import clsx from 'clsx';
import { Badge } from '@material-ui/core';

import { CartContext } from '../../contexts/index.js';
import { addToCart , removeFromCart } from '../../contexts/actions/cart-actions.js';

const useStyles = makeStyles(theme => ({
    qty : {
        color : ({white}) => (white ? theme.palette.secondary.main : "#fff")
    },
    mainGroup : {
        height : "3rem"
    },
    editButtons : {
        height : "1.525rem",
        borderRadius : 0 ,
        backgroundColor : ({white}) => white ? "#fff" : theme.palette.secondary.main,
        borderLeft : ({white}) =>  `2px solid ${ white ? theme.palette.secondary.main : "#fff"}` ,
        borderRight : ({ round }) => round ? 0 : '2px solid #fff' ,
        borderBottom : "none" ,
        borderTop : "none" ,
        borderRadius : ({ round }) => round ? "0px 50px 50px 0px" : 0 , 
        "&:hover" : {
            backgroundColor : ({ white }) => white ? "#fff" : theme.palette.secondary.light
        }
    },
    endButtons : {
        borderRadius : 50,
        backgroundColor : ({white}) => white ? "#fff" : theme.palette.secondary.main ,
        border : "none"
    },
    cartButton : {
        marginLeft : "0 !important" ,
        transition : "background-color 1s ease"
    },
    minusButton : {
        borderTop : ({white}) => `2px solid ${ white ?  theme.palette.secondary.main  : '#fff'}`
    },
    minus : {
        marginTop : "-0.25rem"
    },
    qtyButton : {
        "&:hover" : {
            backgroundColor : ({white}) => white ? "#fff" : theme.palette.secondary.main
        }
    },
    badge : {
        color : "#fff" ,
        fontSize : "1.5rem" ,
        backgroundColor : theme.palette.secondary.main,
        padding : 0
    },
    success : {
        backgroundColor : theme.palette.success.main,
        "&:hover" : {
            backgroundColor : theme.palette.success.main
        }
    }
}))

export default function QtyButton ({stock , variants , selectedVariant , name , isCart , white , hideCartButton , round , override}) {
    const { cart , dispatchCart} = useContext(CartContext)
    const existingItem = isCart ?  cart.find(item => item.variant === variants[selectedVariant]) : null
    const classes = useStyles({ white , round }); // isCart is sent as prop to the styles object
    const [qty , setQtyState] = useState( isCart ? existingItem.qty : 1)

    const [success , setSuccess] = useState(false)
    
    let setQty

    if (override) {
        setQty = val => {
            override.setValue(val)
            setQtyState(val)
        }
    } else {
        //If we dont override we set the name of the function as mentioned below
        setQty = setQtyState
    }

    const handleChange = direction => {
        if (qty === stock[selectedVariant].qty && direction === "up") {
            return null
        }

        if (qty === 1 && direction === "down") {
            return null
        }

        const newQty = direction === "up" ? qty + 1 : qty -1

        setQty(newQty)

        if (isCart) {
            if (direction === "up") {
                dispatchCart(addToCart(variants[selectedVariant] , 1 , name))
            }
            else if (direction === "down") {
                dispatchCart(removeFromCart(variants[selectedVariant] , 1))
            }
        }
    }

    const handleCart = () => {
        setSuccess(true)
        dispatchCart(addToCart(variants[selectedVariant] , qty , name , stock[selectedVariant].qty))
    }

        //Cant return null in useEffect but can return undefined
        useEffect(() => {

            if (stock === null || stock === -1) {
                return undefined
            } else if(qty === 0 && stock[selectedVariant].qty!== 0 ) {
                setQty(1)
            } else if(qty > stock[selectedVariant].qty) {
               setQty(stock[selectedVariant].qty)
           }
        } , [stock , selectedVariant])

        useEffect(() => {
            let timer
            if (success) {
                timer = setTimeout(() => setSuccess(false) , 1500)
            }

            return () => clearTimeout(timer)

        } , [success])

    return (
        <Grid item >
            <ButtonGroup classes={{root : classes.mainGroup}}>
                <Button classes={{root : clsx(classes.endButtons , classes.qtyButton)}}>
                    <Typography variant="h3" classes={{root : classes.qty}}>
                        {qty}
                    </Typography>
                </Button>
                <ButtonGroup orientation="vertical">
                    <Button classes={{root : classes.editButtons}} onClick={() => handleChange("up")}>
                    <Typography variant="h3" classes={{root : classes.qty}}>
                        +
                    </Typography>
                    </Button>
                    <Button classes={{root : clsx(classes.editButtons , classes.minusButton)}} onClick={() => handleChange("down")}>
                    <Typography variant="h3" classes={{root : clsx(classes.qty , classes.minus)}}>
                        -
                    </Typography>
                    </Button>
                </ButtonGroup>

            { hideCartButton ? null : (
            <Button 
            onClick={handleCart} 
            disabled={stock ? stock[selectedVariant].qty === 0 : true}
            classes={{root : clsx(classes.endButtons , classes.cartButton , {
                [classes.success] : success
            })}}>
            { success ? <Typography variant="h3" classes={{root : classes.qtyText}}>
                ✓
                </Typography> : 
                (
                <Badge overlap="circle" badgeContent="+" classes={{badge : classes.badge}}>
                    <Cart color="#fff"/>
                </Badge>
                )}

            </Button>)}

            </ButtonGroup>
        </Grid>
    )
}