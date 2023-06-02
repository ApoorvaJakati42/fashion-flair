'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils")

module.exports = {
    async userSubscriptions(ctx) {
        console.log("userSubscription route backend function start")
        console.log("userSubscription route context object received" + JSON.stringify(ctx))
        console.log("userSubscription route backend state object received " + JSON.stringify(ctx.state))
       // console.log("userSubscription route backend function start")
        
            let subscriptions = await strapi.services.subscription.find({
                user : ctx.state.user.id
            })

            subscriptions.map(subscription => {
                delete subscription.user // This line is to delete user object from subscription object ....
                //... because it is displaying in console .. Security issues
                subscription = sanitizeEntity(subscription , { model : strapi.models.subscription})
            })

            console.log("Subscriptions backend from db " + JSON.stringify(subscriptions));

            ctx.send(subscriptions , 200)

            console.log("userSubscription route backend function end")
    }
};
