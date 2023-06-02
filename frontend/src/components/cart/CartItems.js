import React , {useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

import { CartContext } from '../../contexts';
import Item from './Item';

const useStyles = makeStyles(theme => ({

}))

export default function CartItems () {
    const classes = useStyles();

    const {cart} = useContext(CartContext)

    return (
        <Grid item container lg={6} direction="column">
            {cart.map( item => (
                <Item key={item.variant.id} item={item}/>
            ))}
        </Grid>
    )
}