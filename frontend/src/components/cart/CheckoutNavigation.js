import React , {useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';

import save from "../../images/save.svg";
import Delete from "../../images/Delete";

import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress"
import {FeedBackContext , UserContext} from "../../contexts"
import { setSnackbar , setUser} from "../../contexts/actions"

const useStyles = makeStyles(theme => ({
    navbar : {
        backgroundColor : theme.palette.secondary.main ,
        width : "40rem" ,
        height : "5rem" ,
        position : "relative" ,
        //Absolute positioning will be relative to this item
        [theme.breakpoints.down("sm")] : {
            width : "100%"
        }
    } ,
    back : {
        visibility : ( {steps , selectedStep} ) => selectedStep === 0 || selectedStep === steps.length - 1 ? "hidden" : "visible"
    } ,
    forward : {
        visibility : ( {steps , selectedStep} ) => selectedStep >= steps.length - 2 ? "hidden" : "visible"
    },
    disabled : {
        opacity : 0.5   
     },
     icon : {
        height : "2.25rem",
        width : "2.25rem" ,
        [theme.breakpoints.down("xs")] : {
            height : "1.75rem" ,
            width : "1.75rem"
        }
     },
     delete : {
        height : "2rem" ,
        width : "2rem" ,
        [theme.breakpoints.down("xs")] : {
            height : "1.25rem" ,
            width : "1.25rem"
        }
     },
     actions : {
        //Absolute is used as a frame of reference so it will take right of the entire screen , not Checkout Portal
        position : "absolute",
        right : 0
     } ,
     iconButton : {
        [theme.breakpoints.down("xs")] : {
            padding : 6
        }
     },
     text : {
        [theme.breakpoints.down("xs")] : {
            fontSize : "1.25rem"
        }
     },
     navButton : {
        [theme.breakpoints.down("xs")] : {
            width : "1.5rem" ,
            height : "1.5rem" ,
            minWidth : 0
        }
     }
    }))

export default function CheckoutNavigation ({ steps , selectedStep , setSelectedStep , details , detailSlot , setDetails ,
     location , locationSlot , setLocation , setErrors}) {
    const classes = useStyles({ steps , selectedStep});

    //console.log("SelectedStep index" + selectedStep);
    const [loading , setLoading] = useState(null)
    const {dispatchFeedback} = useContext(FeedBackContext);
    const { user , dispatchUser} = useContext(UserContext)

    const handleAction = action => {
        if (steps[selectedStep].error && action !== "delete") {
            dispatchFeedback(setSnackbar({ status : "error" , message : "All Fields must be valid before saving"}))
            return
        }

        setLoading(action)

        const isDetails = steps[selectedStep].title === "Contact Info"
        const isLocation = steps[selectedStep].title === "Address"

        axios.post(process.env.GATSBY_STRAPI_URL + "/users-permissions/set-settings" , {
            details : isDetails && action !== "delete" ? details : undefined ,
            detailSlot : isDetails ? detailSlot : undefined ,
            location : isLocation && action !== "delete" ? location : undefined ,
            locationSlot : isLocation ? locationSlot : undefined 
        } , {
            headers : {
                Authorization : `Bearer ${user.jwt}`
            }
        }).then(response => {
            setLoading(null)
            dispatchFeedback(setSnackbar({status : "success" , 
            message : `Information ${action === "delete" ? "Deleted" : "Saved"} Successfully`}))
            dispatchUser(setUser({ ... response.data , jwt : user.jwt , onboarding : true}))

            if (action === "delete") {
                setErrors({})
                if (isDetails) {
                    setDetails({name : "" , email : "" , phone : ""})
                } else if (isLocation) {
                    setLocation({ street : "" , zip : "" , city : "" , state : ""})
                }
            }

        }).catch(error => {
            setLoading(null)
            dispatchFeedback(setSnackbar({ status : "error" , 
            message : `${ action === "delete" ? "Deleting" : "Saving"} Information Failed`}))
        })

    }
    

    return (
        <Grid item container justify="center" alignItems="center" classes={{root : classes.navbar}}>
            <Grid item classes={{ root : classes.back}}>
                <Button classes={{root : classes.navButton}} onClick={() => setSelectedStep(selectedStep - 1)}>
                    <Typography variant="h5" classes={{root : classes.text}}>
                        {"<"}
                    </Typography>
                </Button> 
            </Grid>

            <Grid item>
                <Typography variant="h5" classes={{root : classes.text}}>
                    {steps[selectedStep].title.toUpperCase()}
                </Typography>
            </Grid>

            <Grid item  classes={{ root : classes.forward}}>
                 <Button disabled={steps[selectedStep].error} 
                 classes={{root : classes.navButton , disabled : classes.disabled}} onClick={() => setSelectedStep(selectedStep + 1)}>
                    <Typography variant="h5" classes={{root : classes.text}}>
                        {">"}
                    </Typography>
                </Button>     
            </Grid>

        {/* Container prop gives width of 100%
                    So wrap the container in a Grid item so it will take all the
                    100% of the Grid item available space */}
            {steps[selectedStep].hasActions && user.username !== "Guest" ? (                   
                        <Grid item classes={{root : classes.actions}}>
                            <Grid container>
                                <Grid item >
                                    {loading === "save" ? <CircularProgress /> : (
                                        <IconButton classes={{root : classes.iconButton}} onClick={() => handleAction("save")}>
                                            <img src={save} alt="save" className={classes.icon}/>
                                        </IconButton>
                                    )}
                                </Grid>

                                <Grid item >
                                    {/* We need to add the dimensions to the immediate parent component of svg icon element i.e Delete */}
                                    {loading === "delete" ? <CircularProgress /> : (
                                       <IconButton classes={{root : classes.iconButton}} onClick={() => handleAction("delete")}>
                                           <span className={classes.delete}>
                                               <Delete color="#fff"/> 
                                           </span>
                                       </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                    </Grid>
            ) : null }
     
        </Grid>
    )
}