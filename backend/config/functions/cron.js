'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  //for example "*/5 * * * *" ----> */5 runs every 5min 
  //for example "*/1 * * * * *" ----> */1 runs every second


  //The below cron expression is 0 min , 8am in the morning , any day of month , any month of the year , any day of the week 
 // "0 8 * * *" : async () => {

 // }

  //The below cron expression runs every sec , any min , any hour , any day of month , any month of the year , any day of the week 
  // "0/1 * * * * *" : async (date) => {
  //     console.log("Cron date = " + date);
  // }

  //"*/1 * * * *" ---> This expression is to run every minute

  "*/1 * * * *": async () => {
    const subscriptions = await strapi.services.subscription.find({
        next_delivary : new Date() 
    });

    //Promise.all() function makes sure that all the code inside is executed . If any
    // one task fails then it will stop running 

    //allSettled function executes all the tas for every cycle without fail and keep going through

    await Promise.allSettled(
      subscriptions.map(async subscription => {
          const paymentMethods = await stripe.paymentMethods.list({ customer : subscription.user.stripeID , type : "card"})

          const paymentMethod = paymentMethods.data.find(method => method.card.last4 === subscription.paymentMethod.last4)
          //paymentMethod is actually a stripe card to make payment

          //Below code is to create payment and charge money for customer using his card
          try {
            const paymentIntent = await stripe.paymentIntents.create({ 
              amount : Math.round(subscription.variant.price * 1.075 * 1000) ,
              currency : "INR" ,
              customer : subscription.user.stripeID ,
              payment_method : paymentMethod.id ,
              off_session : true , // This both off_session and confirm specifies that this is automated processs , user didnot initiate
              confirm : true
            })

            //Create a new order automatically
            var order = await strapi.services.order.create({ 
              shippingAddress : subscription.shippingAddress ,
              billingAddress : subscription.billingAddress ,
              shippingInfo : subscription.shippingInfo ,
              billingInfo : subscription.billingInfo  ,
              shippingOption : {
                 label : "subscription" ,
                 price : 0
              },
              subtotal : subscription.variant.price ,
              total : subscription.variant.price * 1.075 ,
              tax : subscription.variant.price * 0.075 ,
              items : [
                { 
                  variant : subscription.variant ,
                  name : subscription.name , 
                  qty : subscription.quantity,
                  stock : subscription.variant.qty ,
                  product : subscription.variant.product
                }
              ],
              transaction : paymentIntent.id ,
              paymentMethod : subscription.paymentMethod ,
              user : subscription.user.id ,
              subscription : subscription.id
            })

            const frequencies = await strapi.services.order.frequency()

            //Confirm order automatically and send email to the customer
            const confirmation = await strapi.services.order.confirmationEmail(order)
            await strapi.plugins("email").services.email.send({
              to : subscription.billingInfo.email ,
              subject : "Sniper's order Cnfirmation" ,
              html : confirmation
            })

            //Update subscription for next time
            const frequency = frequencies.find(option => option.value === subscription.frequency)
            await strapi.services.subscription.update({
              id : subscription.id ,
              next_delivary : frequency.delivery()
            })

          } catch (error) {
              //Notify customer that payment failed and prompt them to enter new information 
              console.log(error);
          }


      })
    )

  }

};
