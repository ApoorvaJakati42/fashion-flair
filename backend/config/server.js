module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  cron : { enabled : true }, //This cron property is system utility for scheduling tasks , strapi uses underneath 
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'bf179fe6ba9445736de6bf72c9500484'),
    },
  },
});
