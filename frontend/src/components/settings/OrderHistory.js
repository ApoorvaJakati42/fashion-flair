import React , {useEffect, useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { UserContext } from '../../contexts';
import {Chip} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import detailsIcon from "../../images/details.svg";
import OrderDetails from './OrderDetails';
import SettingsGrid from './SettingsGrid';

const useStyles = makeStyles(theme => ({
    item : {
        height : "100%" ,
        width : "100%"
    }, //All the original styles should be edited within this global tag and should use original regular css syntax and rules
    chipLabel : {
        fontWeight : 600
    }
}))

export default function OrderHistory ({setSelectedSetting}) {
    const classes = useStyles();
    const [orders , setOrders] = useState([])
    const { user } = useContext(UserContext)
    const [open , setOpen] = useState(null)

    //As soon as the component mounts/loads we make a call to get orders and empty array dependancy suggests ....
    //... that it will be called only once after the component loads
    useEffect(() => {
        axios.get(process.env.GATSBY_STRAPI_URL + "/orders/history" , {
            headers : { Authorization : `Bearer ${user.jwt}`}
        }).then(response => {
            console.log( response);
            setOrders(response.data.orders)
        }).catch(error => {
            console.error("Orders History error " + error)
        })
    },[])

    const createData = data => data.map(item => ({
        shipping : `${item.shippingInfo.name}\n${item.shippingAddress.street}\n${item.shippingAddress.city}, ${item.shippingAddress.state} ${item.shippingAddress.zip}` ,
        order : `#${item.id.slice(item.id.length - 10 , item.id.length).toUpperCase()}` ,
        status :  item.status ,
        date : `${item.createdAt.split("-")[2].split("T")[0]}/${item.createdAt.split("-")[1]}/${item.createdAt.split("-")[0]}` ,
        total : item.total ,
        id : item.id
    }))

    const columns = [
                    {field : "shipping" , headerName : "Shipping" , width : 350 , sortable : false} , 
                    {field : "order" , headerName : "Order" , width : 250} , 
                    {
                        field : "status" , 
                        headerName : "Status" , 
                        width : 250 , 
                        renderCell : ({value}) => <Chip classes={{label : classes.chipLabel}} label={value} />
                    } , 
                    {field : "date" , headerName : "Date" , width : 250, type : "date"} ,
                    {
                        field : "total" ,
                        headerName : "Total" , 
                        width : 250 ,
                        renderCell : ({value}) => <Chip classes={{label : classes.chipLabel}} label={`Rs.${value}`} />
                        //renderCell is used to render a component instead of a string
                    },
                    {
                        field : "" ,
                        width : 350 , 
                        sortable : false ,
                        disableColumnMenu : true ,
                        renderCell : () => (
                            <IconButton>
                                <img src={detailsIcon} alt="order details" />
                            </IconButton>
                        )
                    }
                    ]

    const rows = createData(orders)

    return (
        <Grid item container classes={{root : classes.item}}>

            <SettingsGrid setSelectedSetting={setSelectedSetting} 
            rows={rows} 
            columns={columns}
            setOpen={setOpen}
            />
          
            <OrderDetails orders={orders} open={open} setOpen={setOpen}/>

        </Grid>
    )
}