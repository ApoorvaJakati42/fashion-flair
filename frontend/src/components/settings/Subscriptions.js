import React , {useState , useEffect , useContext} from 'react';
import { Chip, Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext , FeedBackContext} from '../../contexts';
import { setSnackbar } from '../../contexts/actions';
import axios from 'axios';

import SettingsGrid from './SettingsGrid';

import QtyButton from '../product-list/QtyButton';

import clsx from 'clsx';

import {IconButton} from '@material-ui/core';
import DeleteIcon from "../../images/Delete";
import pauseIcon from "../../images/pause.svg"

const useStyles = makeStyles(theme => ({
    bold : {
        fontWeight : 600
    },
    productImage : {
        height : "10rem" ,
        width : "10rem"
    },
    method : {
        color : "#fff",
        textTransform : "uppercase",
        marginTop : "1rem"
    },
    lineHeight : {
        lineHeight : 1.1
    },
    deleteWrapper : {
        height : "3rem",
        width : "2.5rem"
    },
    pause : {
        height : "3rem" ,
        width : "3rem"
    } ,
    iconButton : {
        "&:hover" : {
            backgroundColor : "transparent"
        }
    }
}))

export default function Subscriptions ({setSelectedSetting}) {
    const classes = useStyles();
    const { user } = useContext(UserContext)
    const { dispatchFeedback } = useContext(FeedBackContext)
    const [subscriptions , setSubscriptions] = useState([])

    useEffect(() => {
        axios.get(process.env.GATSBY_STRAPI_URL + "/subscriptions/me",{
            headers : {
                Authorization : `Bearer ${user.jwt}`
            }
        }).then(response => {
            console.log("Subscriptions fetch success : " + response.data);
            setSubscriptions(response.data)
        }).catch(error => {
            console.log("Subscriptions fetch error : " + error);
            dispatchFeedback(setSnackbar({status : "error" , message : "There was a problem retrieving your subscriptions. Please try again."}))
        })
    },[])

    console.log("Subscription after receiving from db to Subscriptions state object " + subscriptions);

    //createData function converts each subscription object received into row 
    const createData = data => data.map(({shippingInfo , shippingAddress , billingInfo , billingAddress ,
        paymentMethod , name , variant , quantity , frequency , next_delivary ,id }) => ({
        details : {
            shippingInfo ,
            shippingAddress ,
            billingInfo,
            billingAddress,
            paymentMethod
        },
        item : {
            name ,
            variant
        },
        quantity : {
            quantity ,
            variant,
            name
        },
        frequency ,
        next_delivary ,
        total : variant.price * 1.075 ,
        id 
    }))

    const columns = [
                    {
                        field : "details" ,
                        headerName : "Details" ,
                        width : 450 ,
                        sortable : false ,
                        renderCell : ({value}) => (
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="body2" classes={{root : clsx(classes.lineHeight , classes.bold)}}>
                                    {`${value.shippingInfo.name}`} 
                                    <br/>
                                    {`${value.shippingAddress.street}`}
                                    <br/>
                                    {`${value.shippingAddress.city} , ${value.shippingAddress.state} ${value.shippingAddress.zip}`}
                                     </Typography>
                                </Grid>

                                <Grid item>
                                    <Typography variant='h3' classes={{root : classes.method}}>
                                        {value.paymentMethod.brand} {value.paymentMethod.last4}
                                    </Typography>
                                </Grid>
                            </Grid>
                           
                        )
                    },
                    {field : "item" , headerName : "Item" , width : 250 , sortable : false ,
                        renderCell : ({value}) => (
                            <Grid container direction="column" alignItems='center'>
                                <Grid item>
                                    <img src={process.env.GATSBY_STRAPI_URL + value.variant.images[0].url}
                                    alt={value.name} className={classes.productImage}/>
                                </Grid>

                                <Grid item>
                                    <Typography variant="body2" classes={{root : classes.bold}}>
                                        {value.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )},
                    {field : "quantity" , headerName : "Quantity" , width : 250 , sortable : false ,
                    renderCell : ({value}) => (
                        <QtyButton stock={[{ qty : value.variant.qty}]} variant={value.variant} 
                                    selectedVariant={0} name={value.name} white hideCartButton round />
                    )},
                    {field : "frequency", headerName : "Frequency" , width : 250 , sortable : false ,
                    renderCell : ({value}) => (
                        <Chip label={value.split("_").join(" ")} classes={{label : classes.bold}}/>
                    )},
                    {field : "next_delivary", headerName : "Next Order" , width : 250 ,
                    renderCell : ({value}) => {
                        new Date(value).toLocaleDateString()
                    }},
                    {field : "total", headerName : "Total" , width : 250 ,
                    renderCell : ({value}) => (
                        <Chip label={`Rs. ${value.toFixed(2)}`} classes={{ label : classes.bold}}/>
                    )},
                    {field : "" , width : 250 , sortable : false ,
                    renderCell : () => (
                        <Grid container>
                            <Grid item>
                                <IconButton classes={{root : classes.iconButton}}>
                                    <span className={classes.deleteWrapper}>
                                        <DeleteIcon />
                                    </span>
                                </IconButton>
                            </Grid>

                            <Grid item>
                                <IconButton classes={{root : classes.iconButton}}>
                                    <img src={pauseIcon} alt="pause subscription" className={classes.pause}/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    )} 
                    ]

    const rows = createData(subscriptions)
    
    console.log("Create rows using createData function" + JSON.stringify(rows));

                    //setSelectedSetting sets back button to null and takes back to main page

    return      <SettingsGrid 
                rows={rows} 
                columns={columns} 
                rowsPerPage={3} 
                setSelectedSetting={setSelectedSetting}
                />
}