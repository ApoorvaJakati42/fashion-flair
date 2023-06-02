import React , {useState} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Chip } from '@material-ui/core';
import { Dialog } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import Rating from '../home/Rating';
import { Button } from '@material-ui/core';
import { Link } from 'gatsby';

import frame from '../../images/selected-frame.svg';
import explore from '../../images/explore.svg';
import Sizes from './Sizes';
import Swatches from './Swatches';
import QtyButton from './QtyButton';

import { getStockDisplay } from '../product-detail/ProductInfo';


const useStyles = makeStyles(theme => ({
    selectedFrame : {
        backgroundImage : `url(${frame})`,
        backgroundPosition : "center" ,
        backgroundRepeat : "no-repeat",
        height : "60.4rem" ,
        width : "73.5rem" ,
        padding : "0 !important"
    },
    dialog : {
        maxWidth : "100%"
    },
    productImage : {
        height : "40rem" ,
        width : "40rem" ,
        marginTop : "5rem"
    },
    toolbar : {
        backgroundColor : theme.palette.primary.main,
        height : '13rem',
        marginTop : '2rem' ,
        padding : "0.5rem 1rem",
        position : "relative"
    },
    stock : {
        color : "#fff"
    },
    details : {
        color : "#fff" ,
        textTransform : "none" ,
        fontSize : "1.5rem"
    },
    exploreIcon : {
        height : "1.5rem" ,
        width : "2rem",
        marginLeft : "0.5rem"
    },
    detailButton : {
        padding : 0
    },
    infoContainer : {
        height : "100%"
    },
    chipRoot : {
        transform : "scale(1.5)"
    },
    chipContainer : {
        display : "flex" , //This style is applied to centre the items within a Grid item
        alignItems : "center"
    },
    qtyContainer : {
        marginTop : '2.25rem'
    },
    infoItem : {
        position : "absolute",
        left : "1rem",
        height : "calc(100% - 1rem)"
    },
    actionsItem : {
        position : "absolute",
        right : "1rem"
    }   
}))

export default function QuickView ({open , setOpen , url , name , price , product , 
                            sizes , colors ,selectedSize , selectedColor ,
                             setSelectedColor , setSelectedSize ,
                              variant , hasStyles , stock , imageIndex , rating}) {

    const classes = useStyles();
    
    const selectedVariant = imageIndex === -1 ? product.node.variants.indexOf(variant) : imageIndex

    const stockDisplay = getStockDisplay(stock , selectedVariant)

    return (
        <Dialog classes={{paper : classes.dialog}} open={open} onClose={() => setOpen(false)}>
            <DialogContent classes={{root : classes.selectedFrame}}>
                <Grid container direction="column" alignItems="center" >
                    <Grid item component={Link} 
                    to={`/${product.node.category.name.toLowerCase()}/${product.node.name.split(" ")[0].toLowerCase()}${hasStyles ? `?style=${variant.style}` : ""}`}>
                        <img src={url} alt="product image" className={classes.productImage}/>
                    </Grid>
                    <Grid item container justify="center" classes={{root : classes.toolbar}}>
                        <Grid item classes={{root : classes.infoItem}}>
                            <Grid container direction="column" justify="space-between"
                            component={Link} 
                            to={`/${product.node.category.name.toLowerCase()}/${product.node.name.split(" ")[0].toLowerCase()}${hasStyles ? `?style=${variant.style}` : "" }`}
                            classes={{root : classes.infoContainer}}>
                                <Grid item >
                                    <Typography variant="h4">
                                        {name}
                                    </Typography>
                                    <Rating number={rating}/>
                                </Grid>

                                <Grid item>
                                     <Typography variant="h3" classes={{root : classes.stock}}>
                                        {stockDisplay}
                                    </Typography>
                                    <Button classes={{root : classes.detailButton}}>
                                    <Typography variant="h3" classes={{root : classes.details}}>
                                        Details
                                    </Typography>  
                                    <img src={explore} className={classes.exploreIcon} alt="go to product detail page" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item classes={{root : classes.chipContainer}}>
                            <Chip label={`Rs. ${price}`} classes={{root : classes.chipRoot}}/>
                        </Grid>

                        <Grid item classes={{root : classes.actionsItem}}>
                            <Grid container direction="column">                              
                               <Sizes sizes={sizes} selectedSize={selectedSize} setSelectedSize={setSelectedSize}/>     
                               <Swatches colors={colors} selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>  
                               <span className={classes.qtyContainer}>
                                 <QtyButton name={name}
                                 variants={product.node.variants}
                                 stock={stock} selectedVariant={selectedVariant}/> 
                               </span>
                                                     
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}