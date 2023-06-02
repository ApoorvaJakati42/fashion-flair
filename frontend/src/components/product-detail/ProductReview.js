import React , {useState , useContext , useRef} from 'react';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Rating from "../home/Rating"
import Fields from "../auth/Fields"
import { FeedBackContext} from "../../contexts";
import { setSnackbar } from '../../contexts/actions';
import clsx from "clsx"
import axios from "axios";
import {CircularProgress} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    light : {
        color : theme.palette.primary.main
    },
    date : {
        marginTop : "-0.5rem"
    },
    review : {
        marginBottom : "3rem"
    },
    reviewButtonText : {
        color : "#fff" ,
        fontFamily : "Montserrat" ,
        fontWeight : 600
    },
    rating : {
        cursor : "pointer"
    },
    cancelButtonText : {
        color  : theme.palette.primary.main ,
        fontFamily : "Montserrat" ,
        fontWeight : 600
    },
    delete : {
        backgroundColor : theme.palette.error.main , 
        marginLeft : "0.5rem",
        "&:hover" : {
            backgroundColor : theme.palette.error.dark
        }
    },
    buttonContainer : {
        marginTop : "1rem"
    },
    "@global" : {
        ".MuiInput-underline:before , .MuiInput-underline:hover:not(.Mui-disabled):before" : {
            borderBottom : `2px solid ${theme.palette.primary.main} `   
        },
        ".MuiInput-underline:after" : {
          borderBottom : `2px solid ${theme.palette.secondary.main} `
        }
      }
}))

export default function ProductReview ({ product , review , setEdit , reviews , setReviews , user}) {
    const classes = useStyles();
    const { dispatchFeedback } = useContext(FeedBackContext)

     //If we find the existing review then we have to pre-populate the existing text and rating
    const found = !review ? reviews.find(review => review.user.username === user.username) : null
  
    const [values , setValues] = useState({message : found ? found.text :  ""})
    const ratingRef = useRef(null)
    const [tempRating , setTempRating] = useState(0)
    const [rating , setRating] = useState(review ? review.rating : found ? found.rating : null)
    const [loading , setLoading] = useState(null)


    const fields = {
        message : {
            helperText : "" ,
            placeholder : "Write your review."
        }
    }

    const handleReview = option => {
        console.log("Handle Review function" );
    
        setLoading(option === "delete" ? "delete-review" : "leave-review")

        //1. For Edit functionality ,If found is true then we are updating the review
        //2. For Delete Functionality , if option is delete we follow the below code
        const axiosFunction = option === "delete" ? axios.delete : found ? axios.put : axios.post

        const route = found || option === "delete" ? `/reviews/${found.id}` : "/reviews"

        const auth = { Authorization : `Bearer ${user.jwt}` }
        //Here in axios we are using default controllers , i.e it will be based on the methods(Post , get etc)
      
        axiosFunction(process.env.GATSBY_STRAPI_URL + route , 
            {
                text : values.message,
                product,
                rating ,
                headers : option === "delete" ? auth : undefined ,
            } , 
            {
                headers : auth ,
            }
            ).then(response => {
            console.log("Handle Review function then block");
            setLoading(null)
            dispatchFeedback(setSnackbar({
                status : "success" , 
                message : `${ option === "delete" ? "Review deleted" : "Product Reviewed"} successfully`
            }))
            
            //If we successfully updated a review in strapi the below code runs
            
                let newReviews = [...reviews]
                const reviewIndex = newReviews.indexOf(found)
                
                if (option === "delete") {
                    //Below line will check the list and delete the existing review from the list
                    newReviews = newReviews.filter(review => review !== found)
                } else if (found) {
                    newReviews[reviewIndex] = response.data
                } else {
                    newReviews = [response.data , ...newReviews]
                }
                setReviews(newReviews)
                setEdit(false)
            
        }).catch(error => {
            console.log("Handle Review function catch block");
            setLoading(null)
            console.log(error);
            dispatchFeedback(setSnackbar({
                status : "error" ,
                 message : `There was problem in ${ option === "delete" ? "removing" : "leaving"} your review. Please try again.`
                }))
        })

    }

    const buttonDisabled = found ? found.text === values.message && found.rating === rating  
                            : !rating

    return (
        <Grid item container direction="column" classes={{root : classes.review}}>

            <Grid item container justify="space-between">
                <Grid item>
                    <Typography variant="h4" classes={{root : classes.light}}>
                        {review ? review.user.username : user.username}
                    </Typography>
                </Grid>

                {/* 1. If we access ratingRef.current we get this grid item from thr DOM 
                 2. getBoundingClientRect gives the rectangle box which contains the stars 
                 3..left gives how far away the left edge of the rectangle is from the left side of the screen
                 4. e is the event and clientX is the x co-ordinate , and indicates how far we have moved 
                 5. Entire width is 100% i.e 5 stars , and every 10% is haf a star
                 6. By the below formula i.e using division we get percentage results
                 7. Multilply by -5 so we get the number of stars*/}
                <Grid item 
                classes={{root : clsx({[classes.rating] : !review})}}
                onClick={() => review ? null : setRating(tempRating)}
                onMouseLeave={() => {
                    if(tempRating > rating) {
                        setTempRating(rating)
                    }
                }}
                ref={ratingRef} 
                onMouseMove={e => {

                    if (review) return

                    const hoverRating = ((ratingRef.current.getBoundingClientRect().left - 
                                        e.clientX) / ratingRef.current.getBoundingClientRect().width) * -5

                    setTempRating(Math.round(hoverRating * 2) / 2)
                }}>
                    <Rating number={rating > tempRating ? rating : tempRating} size={2.5}/>
                </Grid>
            </Grid>

            <Grid item >
                <Typography variant="h5" classes={{root : clsx(classes.light , classes.date)}}>
                    {review ? new Date(review.updatedAt).toLocaleString([] , {
                        day : "numeric" ,
                        month : "numeric" ,
                        year : "numeric"
                    }) 
                    : new Date().toLocaleDateString()}
                </Typography>
            </Grid>

            <Grid item>
                {review ? <Typography variant="body1"> {review.text}</Typography>
                : (
                    <Fields values={values} setValues={setValues} fields={fields} fullWidth noError/>
                ) }
            </Grid>

            {review ? null : (
                <Grid item container classes={{root : classes.buttonContainer}}>
                    <Grid item>
                        {loading === "leave-review" ? <CircularProgress/> : (
                            <Button onClick={handleReview} disabled={buttonDisabled} variant="contained" color="primary">
                                <span className={classes.reviewButtonText}>{found ? "Edit" : "Leave"} Review</span>
                            </Button>
                        )}
                    </Grid>

                    {found ? (
                    <Grid item >
                        {loading === "delete-review" ? <CircularProgress /> : (
                         <Button onClick={() => handleReview("delete")} variant='contained' classes={{root : classes.delete}}>
                             <span className={classes.reviewButtonText}>Delete</span>
                         </Button>
                        )}
                    </Grid>
                    ) : null }
    
                    <Grid item>
                        <Button onClick={() => setEdit(false)}>
                            <span className={classes.cancelButtonText}>Cancel</span>
                        </Button>
                    </Grid>
                </Grid>
            )}

        </Grid>
    )
}