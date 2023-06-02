import React , {useEffect, useState , useContext} from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductReview from './ProductReview';
import { UserContext } from '../../contexts';
import { StyledPagination } from '../../templates/ProductList';

import { useQuery } from '@apollo/client';
import { GET_REVIEWS } from '../../apollo/queries';

const useStyles = makeStyles(theme => ({
    reviews : {
        padding : "0 3rem"
    } ,
    pagination : {
        marginBottom : "3rem"
    }, 
    
}))

export default function ProductReviews ({product , edit , setEdit}) {
    const classes = useStyles();
    const { user } = useContext(UserContext)
    const [reviews , setReviews] = useState([])
    const [page , setPage] = useState(1)

    //Here we use apollo to get all the reviews of the given product when this component mounts
    const { data } = useQuery(GET_REVIEWS , { variables : { id : product}})

    //Initial data will be empty array , so when the useQuery runs , we get the data , then the useEffect runs again since the....
    //...paramater that we have passes i.e data is changed
    useEffect(() => {
        if (data) {
            setReviews(data.product.reviews)
        }
    },[data])

    const reviewsPerPage = 15
    const numPages = Math.ceil(reviews.length / reviewsPerPage)

    return (
        <Grid id="reviews" item container direction="column" classes={{root : classes.reviews}}>

            {/* 1. If we click leave a review button then we set edit is true 
            2. So here below we check if edit is true then we display <ProductReview /> component*/}
            {edit && <ProductReview product={product} setEdit={setEdit} reviews={reviews} setReviews={setReviews} user={user}/>}

           {reviews
                .filter(review => edit ? review.user.username !== user.username : review )
                .slice(( page -1) * reviewsPerPage , page * reviewsPerPage)
                .map(review => (
                    <ProductReview 
                    key={review.id} 
                    product={product} 
                    review={review} 
                    reviews={reviews}
                    />
           ))}

           <Grid item container justify="flex-end" >
                <Grid item>
                    <StyledPagination 
                        classes={{root : classes.pagination}} 
                        count={numPages} 
                        page={page} 
                        onChange={(e , newPage) => {
                        setPage(newPage) }} color="primary" 
                        />
                </Grid>
           </Grid>
        </Grid>
    )
}