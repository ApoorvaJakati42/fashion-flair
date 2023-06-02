module.exports = ({env}) => ({ 
    email : {
        provider : "sendgrid" ,
        providerOptions : {
            apiKey : env("SENDGRID_API_KEY")
        },
        settings : {
            defaultFrom : "apoorva.jakati.react@gmail.com",
            defaultTo : "apoorva.jakati.react@gmail.com"
        }
    }}
)