import React , {useState , useEffect} from 'react';
import Layout from '../components/ui/layout';
import { Grid } from '@material-ui/core';
import ProductImages from '../components/product-detail/ProductImages';
import ProductInfo from '../components/product-detail/ProductInfo';
import RecentlyViewed from '../components/product-detail/RecentlyViewed';
import { useMediaQuery } from '@material-ui/core';
import ProductReviews from '../components/product-detail/ProductReviews';

import {useQuery } from "@apollo/client";
import { GET_DETAILS } from '../apollo/queries';


export default function ProductDetail({ pageContext : {name , id , category , description , variants , product} }) {

    const [selectedVariant , setSelectedVariant] = useState(0);
    const [selectedImage , setSelectedImage] = useState(0);
    const [stock , setStock] = useState(null)
    const [rating , setRating] = useState(0)
    const [edit , setEdit] = useState(false)

    const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : {get : () => null}

    const recentlyViewedProducts = typeof window !== "undefined" ? 
    JSON.parse(window.localStorage.getItem("recentlyViewed")) : null
    const style = params.get("style")

    //Here we are making apollo query to get the stock and rating
    const {loading , error , data} = useQuery(GET_DETAILS , {
        variables : { id } //id is passes from line 24 as argument
    })

    useEffect(() => {
        if (error) {
            setStock(-1)
        }
        else if (data) {
            setStock(data.product.variants)
            setRating(data.product.rating)
        }
    } , [error , data])

    console.log(stock);

    useEffect(() => {
        
        const styledVariant = variants.filter(variant => variant.style === params.get("style"))[0]

        const variantIndex = variants.indexOf(styledVariant);

        var recentlyViewed = JSON.parse(window.localStorage.getItem("recentlyViewed"))

        if (recentlyViewed) {
            if (recentlyViewed.length === 10) {
                recentlyViewed.shift()
            }

            if (!recentlyViewed.some(product => product.node.name === name && product.selectedVariant === variantIndex)) {
                recentlyViewed.push({...product , selectedVariant : variantIndex})
            }

        } else {
            recentlyViewed = [{...product , selectedVariant : variantIndex}]
        }

        window.localStorage.setItem("recentlyViewed" , JSON.stringify(recentlyViewed))

        setSelectedVariant(variantIndex)

    } , [style])

    return (
            <Layout>
                <Grid container direction="column">
                    <Grid item container direction={matchesMD ? "column" : "row"}>
                        <ProductImages 
                        images={variants[selectedVariant].images}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}/>

                        <ProductInfo name={name} 
                        description={description} 
                        variants={variants} 
                        selectedVariant={selectedVariant}
                        setSelectedVariant={setSelectedVariant}
                        stock={stock}
                        setEdit={setEdit}
                        rating={rating}
                        product={id}/>
                    </Grid>

                    <RecentlyViewed products={recentlyViewedProducts}/>

                    <ProductReviews product={id} edit={edit} setEdit={setEdit}/>
                </Grid>
            </Layout>
            )
}