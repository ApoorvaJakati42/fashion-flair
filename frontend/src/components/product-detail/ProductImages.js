import React , {useState} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Chip } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    selected : {
        height : "40rem" ,
        width : "40rem",
        [theme.breakpoints.down("sm")] : {
            height : "30rem" ,
            width : "30rem"
        },
        [theme.breakpoints.down("xs")] : {
            height : "20rem" ,
            width : "20rem"
        }
    },
    small : {
        height : "5rem" ,
        width : "5rem" ,
        [theme.breakpoints.down("xs")] : {
            height : "3rem" ,
            width : "3rem",
        }
    },
    imageItem : {
        margin : "1rem" 
    }
}))

export default function ProductImages ({images , selectedImage , setSelectedImage}) {
    const classes = useStyles();

    return (
        <Grid item container direction="column" alignItems="center" lg={6}>
            <Grid item>
                <img src={process.env.GATSBY_STRAPI_URL + images[selectedImage].url} 
                alt="product_large" className={classes.selected}/>
            </Grid>
            <Grid item container justify="center">
                {images.map((image , i) => (
                    
                    <Grid classes={{root : classes.imageItem}} item key={image.url}>
                        <IconButton onClick={() => setSelectedImage(i)}>
                        <img src={process.env.GATSBY_STRAPI_URL + image.url} 
                        alt={`product_small${i}`} className={classes.small}/>
                        </IconButton>
                    </Grid>
                   
                ))}
            </Grid>
        </Grid>
    )
}