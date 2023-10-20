const { connect, connection } = require('mongoose');
require('dotenv').config({ path: './config.env' });


connect(process.env.DATABASE_LOCAL, {
   useNewUrlParser: true
});

connection.on("error", err => console.log(err.message))
   .once("open", () => console.log('DATABASE successfully connected'));

