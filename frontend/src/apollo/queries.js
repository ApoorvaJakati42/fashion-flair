import { gql } from "@apollo/client";       

        export const GET_DETAILS = gql`
                    query getDetails($id: ID!) {
                        product(id: $id) {
                            rating 
                            variants {
                                qty
                            }
                        }
                    }
                `

                    //Here we are using apollo to make a runtime query , to grab the reviews when the user visits the page 
        export const GET_REVIEWS = gql`
            query getReviews($id: ID!) {
                product(id: $id) {
                    reviews {
                        id 
                        text
                        rating
                        updatedAt
                        user {
                            username
                        }
                    }
                }
            }
        `

                //ID! ... ! is used to make it as required and ID will be present in graphql query
                //$id ... This is variable declared