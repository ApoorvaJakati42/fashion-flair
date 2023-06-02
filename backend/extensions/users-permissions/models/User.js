var stripe = require("stripe")(process.env.STRIPE_SK)

module.exports = {
    lifecycles : {
        //These slots are created before a user is created automatically
       async beforeCreate(data) {

        //This line is used to create customer inside the stripe server
            const customer = await stripe.customers.create({ name : data.username , email : data.email})

            data.stripeId = customer.id

            data.paymentMethods = [{brand : "" , last4 : ""} , {brand : "" , last4 : ""} , {brand : "" , last4 : ""}]

            data.contactInfo = [{name : data.username , email : data.email , phone : ""} , 
                                {name : "" , email : "" , phone : ""} , {name : "" , email : "" , phone : ""}]

            data.locations = [{street : "" , zip : "" , city : "" , state : ""} , {street : "" , zip : "" , city : "" , state : ""},
                              {street : "" , zip : "" , city : "" , state : ""}]                    
        } 

    },
};