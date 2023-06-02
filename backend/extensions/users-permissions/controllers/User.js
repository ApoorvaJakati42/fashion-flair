const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

  module.exports = {
      async setSettings(ctx) {
         const { id , contactInfo , locations } = ctx.state.user //This is the profile who made the request
         const { details , detailSlot , location , locationSlot} = ctx.request.body //This is the data from the request

         let newInfo = [...contactInfo]
         let newLocations = [...locations]

         if (typeof details !== "undefined" && typeof detailSlot !== "undefined") {
             newInfo[detailSlot] = details
         } else if (typeof details === "undefined" && typeof detailSlot !== "undefined") {
             newInfo[detailSlot] = {name : "" , email : "" , phone : ""}
         }

         if (typeof location !== "undefined" && typeof locationSlot !== "undefined") {
            newLocations[locationSlot] = location
        } else if (typeof location === "undefined" && typeof locationSlot !== "undefined") {
            newLocations[locationSlot] = { street : "" , zip : "" , city : "" , state : ""}
        }

        let newUser = await strapi.plugins["users-permissions"].services.user.edit({ id } ,
             { contactInfo : newInfo , locations : newLocations})

         newUser  = sanitizeUser(newUser)  
         
         //This will be sent as a response from strapi
         ctx.send( newUser , 200 )
      },

      async changePassword(ctx) {
        const { id } = ctx.state.user 
        const { password } = ctx.request.body

        await strapi.plugins["users-permissions"].services.user.edit({ id } , { password })

        ctx.send("Password Changed Successfully" , 200)
      },

    
      async me(ctx) {
        const user = ctx.state.user;
        console.log("7875 start");
        if (!user) {
          return ctx.badRequest(null , [{messages : [{ id : 'No Authorization header was found'}]}]);
        }

        console.log("me function start");

        let newUser = {...sanitizeUser(user)}
        const favorites = await strapi.services.favorite.find({ user })
        const subscriptions = await strapi.services.subscription.find({ user })

        console.log("Favorites start ");

        newUser.favorites = favorites.map(favorite => ({
             variant : favorite.variant.id ,
             id : favorite.id
        }))

        console.log("Subscriptions start 25");
        console.log(subscriptions);
        console.log("Subscriptions end 25");
        newUser.subscriptions = subscriptions.map((subscription) => {
          delete subscription.user
          return subscription
        })

        ctx.body = newUser;
      }
  }