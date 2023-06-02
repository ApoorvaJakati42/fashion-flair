'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
    async average(id) {

        //Here id , is the Product id 
        const product = await strapi.services.product.findOne({ id })

        //Reduce function is used to go through the list and take all the values , add it and return it as single value
        const total = product.reviews.reduce((total , review) => total + review.rating , 0)

        let average = total / product.reviews.length

        //If there are no reviews then this condition executes
        if (product.reviews.length === 0) {
            average = 0
        }

        //Average is saved to the nearest half
        await strapi.services.product.update({ id } , { rating : Math.round(average * 2) / 2 })
    }
};
