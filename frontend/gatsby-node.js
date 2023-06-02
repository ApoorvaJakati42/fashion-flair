  exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => { 
      if (stage === "build-html") { 
          actions.setWebpackConfig({ 
              module: { 
                  rules: [
                      { test: /react-spring-3d-carousel/,
                         use: loaders.null() }
                        ], 
                    }, }) 
                }}

   exports.createPages = async ({ graphql , actions}) => {
       const { createPage } = actions

       const results = await graphql(`
       
            {
            products: allStrapiProduct {
            edges {
                node {
                strapiId
                name
                description
                category {
                    name
                  }
                variants {
                    id
                    color
                    size
                    style
                    price
                    images {
                        url
                    }
                }  
                }
            }
            }
           categories: allStrapiCategory {
            edges {
                node {
                strapiId
                name
                description
                filterOptions {
                    Size {
                        checked
                        label
                    }
                    Style {
                        checked
                        label
                    }
                    Color {
                        checked
                        label
                    }
                }
                }
            }
            }
        }
      
       `)

       if (results.errors) {
           throw results.errors
       }

       const products = results.data.products.edges
       const categories = results.data.categories.edges

       products.forEach(product => {
           createPage({
               path: `/${product.node.category.name.toLowerCase()}/${product.node.name.split(" ")[0]}`,
               component :  require.resolve("./src/templates/ProductDetail.js"),
               context : {
                    name : product.node.name ,
                    id : product.node.strapiId ,
                    category : product.node.category.name,
                    description : product.node.description,
                    variants : product.node.variants,
                    product : product
               }
           })
       })

       categories.forEach(category => {
        createPage({
            path: `/${category.node.name.toLowerCase()}`,
            component : require.resolve("./src/templates/ProductList.js"),
            context : {
                name : category.node.name ,
                description : category.node.description ,
                id : category.node.strapiId ,
                filterOptions : category.node.filterOptions
            }
        })
    })
   }             