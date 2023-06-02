import React , {useState , useRef , useEffect} from 'react';
import Layout from '../components/ui/layout';
import { Grid } from '@material-ui/core';
import DynamicToolbar from '../components/product-list/DynamicToolbar';
import {graphql} from 'gatsby';
import ListOfProducts from '../components/product-list/ListOfProducts';
import { makeStyles , styled } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import { alphabetic , time , price } from '../components/product-list/SortFunctions';

import {useQuery } from "@apollo/client";
import { GET_DETAILS } from '../apollo/queries';
import PaginationItem from '@material-ui/lab/PaginationItem';

const useStyles = makeStyles(theme => ({
    fab : {
        alignSelf : "flex-end",
        marginRight : "2rem" ,
        marginBottom : "2rem" ,
        color : "#fff" ,
        fontFamily : "Montserrat" ,
        fontSize : "5rem" ,
        width : "5rem" , 
        height : "5rem"
    },
    pagination : {
        alignSelf : "flex-end",
        marginRight : "2%",
        marginTop : "-3rem",
        marginBottom : "4rem",
        [theme.breakpoints.only("md")] : {
            marginTop : "1rem"
        }
    }
}))

export const StyledPagination = props => {
            //1.Here we are creating our own styled component using styled component
            //2.Here in the second argument we add styles that is needed so it will be applied to the root of the Component
             const StyledPaginationItem = styled(PaginationItem)(({theme}) => ({
                fontFamily : "Montserrat" ,
                fontSize : "2rem" ,
                color : theme.palette.primary.main,
                "&.Mui-selected" : {
                    color : "#fff"
                }
            }))

            return <Pagination {...props} renderItem={item => <StyledPaginationItem {...item}/>}/>
}


export default function ProductList({ 
    pageContext : {filterOptions : options , name , description , id} , 
    data : {allStrapiProduct : {edges : products}} } ) 
    {

        const classes = useStyles();
        const [layout , setLayout] = useState("grid");
        const [page , setPage] = useState(1)
        const [filterOptions , setFilterOptions] = useState(options);
        const [sortOptions , setSortOptions] = useState([
            {label : "A-Z" , active : true , function : data => alphabetic(data , "asc")}, 
            {label : "Z-A" , active : false , function : data => alphabetic(data , "desc")}, 
            { label : "NEWEST" , active : false , function : data => time(data , "asc")}, 
            { label : "OLDEST" , active : false , function : data => time(data , "desc")}, 
            { label : "PRICE ↑" , active : false ,  function : data => price(data , "asc")}, 
            { label : "PRICE ↓" , active : false , function : data => price(data , "desc")}, 
            { label : "REVIEWS" , active : false , function : data => data}
            ])

            const [stock , setStock] = useState(null)   
        const scrollRef  = useRef(null);
    
        const scroll = () => {
            scrollRef.current.scrollIntoView({ behavior : "smooth"})
        }

        const {loading , error , dataFromApolloQuery} = useQuery(GET_DETAILS , {
            variables : { id } //id is passes from line 24 as argument
        })
    
        useEffect(() => {
            if (error) {
                setStock(-1)
            }
            else if (dataFromApolloQuery) {
                setStock(dataFromApolloQuery.product.variants)
            }
        } , [error , dataFromApolloQuery])
    
        console.log(stock);

        useEffect(() => {
            setPage(1)
        } , [filterOptions , layout])

        const productsPerPage = layout === "grid" ? 16 : 6
        
        var content = []

        
        const selectedSort = sortOptions.filter(option => option.active)[0]
        const sortedProducts = selectedSort.function(products)
      

        sortedProducts.map((product , i) => product.node.variants.map(variant => content.push({ product : i , variant})))
    
        var isFiltered = false
        var filters = {} //var filters = {Size : ["S" , "M"] , Style : ["Female"]}
        var filteredProducts = []
    
        
            Object.keys(filterOptions).filter(option => filterOptions[option] !== null)
            .map(option => {
                filterOptions[option].forEach(value => {
                    if (value.checked) {
                        isFiltered = true
                       
                        if (filters[option] === undefined ) {
                            filters[option] = []
                        }
    
                        if (!filters[option].includes(value)) {
                            filters[option].push(value)
                        }
    
                        content.forEach(item => {
                            if (option === "Color") {
                                if (item.variant.colorLabel === value.label && !filteredProducts.includes(item)) {
                                    filteredProducts.push(item)
                                }
                            }
                            else if(item.variant[option.toLowerCase()] === value.label && !filteredProducts.includes(item)) {
                                filteredProducts.push(item)
                            }
                        })
                    }
                })
            })
    
            Object.keys(filters).forEach(filter => {
                filteredProducts = filteredProducts.filter(item => {
                    let valid
    
                    filters[filter].some(value => {
                        if (filter === "Color") {
                            if (item.variant.colorLabel === value.label) {
                                valid = item
                            }
                        }
                        else if (item.variant[filter.toLowerCase()] === value.label) {
                            valid = item
                        }
                    })
    
                    return valid
                })
                
            })
    
    
        if (isFiltered) {
            content = filteredProducts
        }

        
        const numPages = Math.ceil(content.length / productsPerPage)

    return (
     <Layout>
         <Grid container direction="column" alignItems="center">
             <div ref={scrollRef}/>
            <DynamicToolbar 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions}
            sortOptions={sortOptions}
            setSortOptions={setSortOptions}
            name={name} 
            description={description} 
            layout={layout} 
            setLayout={setLayout} 
            />

            <ListOfProducts 
            page={page} 
            filterOptions={filterOptions} 
            productsPerPage={productsPerPage} 
            products={products} 
            content={content}
            layout={layout}/>

            <StyledPagination 
                count={numPages} 
                page={page} 
                onChange={(e , newPage) => setPage(newPage)} 
                color="primary" 
                classes={{root : classes.pagination}}
                />

            <Fab onClick={scroll} color="primary" classes={{root : classes.fab}}> ^ </Fab>
         </Grid>
     </Layout>
    )
}

export const query = graphql`
query GetCategoryProducts($id: String!) {
    allStrapiProduct(filter: {category: {id: {eq: $id}}}) {
      edges {
        node {
          strapiId
          createdAt
          name
          category {
              name
          }
          variants {
            color
            id
            price
            size
            style
            colorLabel
            images {
              url
            }
          }
        }
      }
    }
  }
`