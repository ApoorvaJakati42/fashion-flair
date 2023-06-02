import React , {useState } from 'react';
import { useStaticQuery , graphql } from 'gatsby';
import { Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import featuredAdornment from '../../images/featured-adornment.svg';

import FeaturedProduct from './FeaturedProduct';

const useStyles = makeStyles(theme => ({
    background : {
        backgroundImage : `url(${featuredAdornment})`,
        backgroundPosition : "top" ,
        backgroundSize : "cover" ,
        backgroundRepeat : "no-repeat",
        width : "100%" ,
        height : "180rem",
        padding : " 0 2.5rem",
        [theme.breakpoints.down("md")] : {
            height : '220rem' 
        }
    } 
}))

export default function FeaturedProducts() {

    const classes = useStyles();
    const [expanded , setExpanded] = useState(null)
    const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"));
    
    const data = useStaticQuery(graphql`
    query GetFeatured {
        allStrapiProduct(filter: {featured: {eq: true}}) {
          edges {
            node {
              strapiId
              category {
                name
              }
              name
              variants {
                price
                style
                images {
                  url
                }
              }
            }
          }
        }
      }
    `)

    console.log(data.allStrapiProduct);

   

    return (
       <Grid container direction="column" justify={matchesMD ? "space-between" : "center"} classes={{root : classes.background}}>
          {/* This is a call back function. we are mapping over all the strapiProducts */}
          {data.allStrapiProduct.edges.map(({node}, i) => (
                 <FeaturedProduct 
                 key={node.strapiId} 
                 expanded={expanded}
                 setExpanded={setExpanded}
                 node={node} i={i} 
                 matchesMD={matchesMD} />
            ))}
       </Grid>
    )
}