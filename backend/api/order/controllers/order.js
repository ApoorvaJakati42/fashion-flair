'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils")
const stripe = require("stripe")(process.env.STRIPE_SK)
const GUEST_ID = "632a8ec61857b54558f4f311"

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

  
module.exports = {

    async process(ctx) {
        const { items , total , shippingOption ,idempotencyKey ,storedIntent ,email , savedCard} = ctx.request.body
        
        let orderCustomer;

        //This will be the valid user who made request with proper jwt
        if (ctx.state.user) {
            orderCustomer = ctx.state.user.id
        } else {
            orderCustomer = GUEST_ID
        }

        let serverTotal = 0 
        let unavailable = [] //Unavailable items in the cart

        //Promise is asynchronous code and in Promise.all() we put async code and this is going to wait 
        //for all of them to succeed before it moves on
        //Inside the function we look up all the items from the db and the ui
        await Promise.all(
                items.map(async (clientItem) => {
                    const serverItem = await strapi.services.variant.findOne({ 
                        id : clientItem.variant.id
                    })

                    if (serverItem.qty < clientItem.qty) {
                        unavailable.push({ id : serverItem.id , qty : serverItem.qty})
                    }

                    serverTotal += serverItem.price * clientItem.qty
 
                })
        )

            const shippingOptions = [
                { label : "FREE SHIPPING" , price : 0} , 
                {label : "2-DAY" , price : 80} , 
                {label : "OVERNIGHT SHIPPING" , price : 150}
            ]

            const shippingValid = shippingOptions.find(option => 
            option.label === shippingOption.label && option.price === shippingOption.price )

            //This below condition is added to check the price tampering done by customer while placing the order
            if (shippingValid === undefined ||
                    ((serverTotal + shippingValid.price) * 1.075 ).toFixed(2) !== total) {
                //If Either of this condition is true then we have invalid cart
                console.log("Invalid Cart 400 ");
                ctx.send({ error : "Invalid Cart"} , 400)
            } else if (unavailable.length > 0 ) {
                //If any one product is unavailable then we should cancel the order
                ctx.send({ unavailable} , 409)
                console.log("Product is unavailable 409 ");
            } else {
                //This else condition is valid cart is available and we generate payment intent
                //StoredIntent means they have already added items to the cart and thet payment intent is already created...
                //...so we update the intent

                if (storedIntent) {
                    //Here we update the intent
                    const update = await stripe.paymentIntents.update(storedIntent , {
                        amount : total * 100 //Multiply by 100 because the amount property in stripe is in cents                     
                    },{ idempotencyKey})  //idempotency key prevents duplicate requests

                    ctx.send({ client_secret : update.client_secret , intentId : update.id})               
                } else {
                    //Generate a new payment intent

                    let saved;
                    if (savedCard) {
                        const stripeMethods = await stripe.paymentMethods.list({customer : ctx.state.user.stripeId , type : "card"})
                        //Below line by using savedcard i.e last 4 digits (4242) we get full card details from the ...
                        //... stripeMethods
                        saved = stripeMethods.data.find(method => method.card.last4 === savedCard)    
                    }

                    const intent = await stripe.paymentIntents.create({ 
                        amount : total * 100 ,
                        currency : "INR" ,
                        customer : ctx.state.user ? ctx.state.user.stripeId : undefined ,
                        receipt_email : email ,
                        payment_method : saved ? saved.id : undefined
                    } , { idempotencyKey })
                    

                    ctx.send({client_secret : intent.client_secret , intentId : intent.id})
                }
                }

    } ,

    async finalize(ctx) {
        const { shippingAddress , billingAddress , shippingInfo , billingInfo ,
        shippingOption , subTotal , tax , total , items , transaction ,paymentMethod , saveCard , cardSlot} = ctx.request.body

        console.log("Order Controller " + shippingAddress , billingAddress , shippingInfo , billingInfo ,
        shippingOption , subTotal , tax , total , items);

        let orderCustomer;

        //This will be the valid user who made request with proper jwt
        if (ctx.state.user) {
            orderCustomer = ctx.state.user.id
        } else {
            orderCustomer = GUEST_ID
        }

        //Promise is asynchronous code and in Promise.all() we put async code and this is going to wait 
        //for all of them to succeed before it moves on
        //Inside the function we look up all the items from the db and the ui

        const frequencies = await strapi.services.order.frequency()

        await Promise.all(
                items.map(async (clientItem) => {
                    const serverItem = await strapi.services.variant.findOne({ 
                        id : clientItem.variant.id
                    })

                    if (clientItem.subscription) {
                        const frequency = frequencies.find(option => option.label === clientItem.subscription)
                        await strapi.services.subscription.create({ 
                             user : orderCustomer ,
                             variant : clientItem.variant.id , 
                             name : clientItem.name , 
                             frequency : frequency.value , 
                             last_delivary : new Date() ,
                            next_delivary : frequency.delivery() ,
                             quantity : clientItem.qty ,
                             paymentMethod , 
                             shippingAddress , 
                             billingAddress , 
                             shippingInfo , 
                             billingInfo
                            })
                    }

                    await strapi.services.variant.update(
                        {id : clientItem.variant.id} ,
                        {qty : serverItem.qty - clientItem.qty})             
                })
             )

             if (saveCard && ctx.state.user) {
                //If user is logged in and they want to save the card then this block runs and we edit the ....
                //.. information of the user in the strapi database
                let newMethods = [...ctx.state.user.paymentMethods]

                newMethods[cardSlot] = paymentMethod

                await strapi.plugins["users-permissions"].services.user.edit({id : orderCustomer} , {
                    paymentMethods : newMethods
                })
             }

             var order = await strapi.services.order.create({ 
                shippingAddress ,
                billingAddress ,
                shippingInfo ,
                billingInfo ,
                shippingOption ,
                subTotal ,
                tax ,
                total ,
                items ,
                transaction ,
                paymentMethod ,
                user : orderCustomer
             })

             order = sanitizeEntity(order , { model : strapi.models.order })

             //Below line generates the Html template 
             const confirmation = await strapi.services.order.confirmationEmail(order)
             //Below line is used to send email manually using strapi
             await strapi.plugins["email"].services.email.send({
                to : order.billingInfo.email ,
                subject : 'VAR-X Order Confirmation' ,
                html : confirmation
             })

             console.log("Email Send to --->" + order.billingInfo.email);

             if (order.user.username === "Guest") {
                order.user = { username : "Guest"}
             }

             ctx.send({ order } , 200)

             //Finally we should bind this controller to a route
             //open config folder 
    } ,

    async removeCard(ctx) {
        const { card } = ctx.request.body
        const { stripeId } = ctx.state.user
        
        const stripeMethods = await stripe.paymentMethods.list({
             customer : stripeId , type : "card"}) //Here we get all the cards that are saved for the customer

        //This below line gives the full card information by comparing the last
        const stripeCard = stripeMethods.data.find( method => method.card.last4 === card) 
        
        //Below line removes card from stripe 
        await stripe.paymentMethods.detach(stripeCard.id)
        
        //Below line removes from strapi user so we need to modify user saved payment methods
        let newMethods = [...ctx.state.user.paymentMethods]

        const cardSlot = newMethods.findIndex(method => method.last4 === card)

        newMethods[cardSlot] = { brand : "" , last4 : ""}

        const newUser = await strapi.plugins["users-permissions"].services.user.edit({ id : ctx.state.user.id} ,
             { paymentMethods : newMethods})

        //Below line we send new user profile to update react context
        ctx.send({ user : sanitizeUser(newUser)} , 200 )
        
    } ,

    async history(ctx) {
        const orders = await strapi.services.order.find({ user : ctx.state.user.id})

        const cleanOrders = orders.map(order => sanitizeEntity(order , { model : strapi.models.order}))

        ctx.send({orders : cleanOrders} , 200 )
    }
};
