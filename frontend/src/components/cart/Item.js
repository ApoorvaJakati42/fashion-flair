import React , {useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles , useTheme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import {Chip} from '@material-ui/core';
import { CartContext } from '../../contexts';
import { removeFromCart , changeFrequency} from '../../contexts/actions';
import {useMediaQuery} from '@material-ui/core';
import clsx from "clsx";

import QtyButton from '../product-list/QtyButton';
import FavouriteIcon from "../ui/favorite";
import DeleteIcon from "../../images/Delete"
import SelectFrequency from '../ui/select-frequency';

import SubscriptionIcon from "../ui/subscription"

const useStyles = makeStyles(theme => ({
    productImage : {
        height : "10rem",
        width : "10rem"
    },
    name : {
        color : theme.palette.secondary.main
    },
    id : {
        color : theme.palette.secondary.main,
        fontSize : "1rem",
        [theme.breakpoints.down("xs")] : {
            fontSize : "0.75rem"
        }
    },
    actionWrapper : {
        height : "3rem",
        width : "3rem" ,
        [theme.breakpoints.down("xs")] : {
            height : "2rem" ,
            width : "2rem"
        }
    },
    infoContainer : {
        width : "35rem" ,
        height : ({subscription}) => subscription ? "10rem" : "8rem" ,//Here the 10rem prop is not applying . Please check later
        position : "relative",
        marginLeft : "1rem"
    },
    chipWrapper : {
        top :({subscription}) => subscription ? "3.5rem" : "3.5rem" ,
        position : "absolute" //If this item is given absolute then we should give the parent component as relative
    },
    itemContainer : {
        margin : "2rem 0 2rem 2rem" ,//3rem on top and bottom and 0 for left and right
        [theme.breakpoints.down("md")] : {
            margin : "2rem 0"
        }
    },
    actionButton : {
        [theme.breakpoints.down("xs")] : {
            padding : "12px 6px"
        },
        "&:hover" : {
            backgroundColor : "transparent"
        }
    },
    chipRoot : {
        marginLeft : "1rem" ,
        "&:hover" : {
            cursor : "pointer"
        }
    },
    actionContainer : {
        marginBottom: "-0.5rem"
    },
    favoriteIcon : {
        marginTop : 2
    },
    chipLabel : {
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.25rem"
        }
    },
    lastContainer : {
        marginTop : "2.5rem"
    }
}))

export default function Item ({ item }) {
    const classes = useStyles({ subscription : item.subscription});

    const [frequency , setFrequency] = useState(item.subscription || "Month")

    const theme = useTheme();
    const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

    const {dispatchCart} = useContext(CartContext)

    const handleDelete = () => {
        dispatchCart(removeFromCart(item.variant , item.qty))
    }

    const handleFrequency = newFrequency => {
        dispatchCart(changeFrequency(item.variant , newFrequency))
        setFrequency(newFrequency)
    }

    const actions = [
        { 
            component : FavouriteIcon ,
             props : {
            color : theme.palette.secondary.main ,
            size : matchesXS ? 2 : 3 ,
            buttonClass : clsx(classes.actionButton , classes.favoriteIcon) ,
            variant : item.variant.id
        }
        } , 
        { 
            component : SubscriptionIcon ,
            props : {
            color : theme.palette.secondary.main ,
            isCart : item ,
            size : matchesXS ? 2 : 3 ,
            cartFrequency : frequency
            } 
        } ,
           {
            icon : DeleteIcon ,
             color : theme.palette.error.main , size : matchesXS ? "1.75rem" :  "2.5rem" , onClick : handleDelete
            }
        ]

    return (
        <Grid item container  classes={{root : classes.itemContainer}}>
            <Grid item >
                <img
                className={classes.productImage}
                src={process.env.GATSBY_STRAPI_URL + item.variant.images[0].url}
                alt={item.variant.id} />
            </Grid>

            <Grid item container direction={matchesXS ? "row" : "column"} justifyContent ="space-between" classes={{root : classes.infoContainer}}>

                <Grid item container justify="space-between" >
                    <Grid item>
                        <Typography variant="h5" classes={{root : classes.name}}>
                            {item.name}
                        </Typography>
                    </Grid>

                    <Grid item >
                        <QtyButton name={item.name} selectedVariant={0}
                         variants={[item.variant]} stock={[{ qty : item.stock}]} 
                         isCart white hideCartButton/>
                    </Grid>

                    <Grid item container alignItems='center' classes={{root : classes.chipWrapper}}>
                        <Grid item>
                            <Chip label={`$${item.variant.price}`} />
                        </Grid>
                        
                        {item.subscription ? (
                        <Grid item> 
                            <SelectFrequency 
                            chip={
                                <Chip classes={{root : classes.chipRoot , label : classes.chipLabel}} 
                                label={`Every ${frequency}`}
                                />
                             } 
                            value={frequency} 
                            setValue={handleFrequency} 
                         />
                        </Grid>
                        ) 
                        : null}
                    </Grid>

                    <Grid item container classes={{root : classes.lastContainer}} justifyContent="space-between" alignItems="flex-end">
                        <Grid item sm xs={7}>
                            <Typography variant="body1" classes={{root : classes.id}}>
                            ID : {item.variant.id}
                            </Typography>
                        </Grid>

                            {/* Specifiying sm will automatically share the space */}
                        <Grid item container sm xs={5} justifyContent="flex-end" classes={{ root : classes.actionContainer}}>
                            {actions.map((action , i) => (
                                <Grid item key={i}> 
                                    {action.component ? (
                                        <action.component {...action.props}/>
                                    ) : (
                                        <IconButton classes={{root : classes.actionButton}}
                                            disableRipple onClick={() => action.onClick()}>
                                            <span className={classes.actionWrapper} 
                                            style={{height : action.size , width : action.size}} >
                                                <action.icon color={action.color}/>
                                            </span>
                                       </IconButton>
                                    )}
                                    
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
}