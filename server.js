const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


//! Uncaught Exception ERROR
process.on('uncaughtException', err => {
    console.log(`ERROR::: ${err}`)
    console.log('ERROR_Stack:::', err.stack)
    console.log(`Uncaught Exception, Shutting Down the Server... 😟😟😟😟😟`);
    process.exit(1)
})

//? setting up the port 
const PORT = process.env.PORT || 8000;


//! Initializing special configs
const app = express();

dotenv.config({
    path: path.resolve(__dirname, 'config', '.env')
})


//! database Connection establishing

const db = process.env.MONGOURI

const connecttoDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database connected SuccessFully')
    } catch (err) {
      console.log(`Error Connection to database : ${err}`)

      process.exit(1)
    }
}
//! database Connection established
connecttoDB()


//! INIT middleWares
app.use(express.json({ extended: false }))

var corsOptions = {
    // "Access-Control-Allow-Origin": '*',
    origin: [`http://localhost:3000`, 'https://dev-rapport.herokuapp.com/'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


//@ routes definations
app.use('/api/users', require('./routes/api/usersRoutes'));
app.use('/api/profile', require('./routes/api/profileRoutes'));
app.use('/api/posts', require('./routes/api/postsRoutes'));
app.use('/api/auth', require('./routes/api/authRoutes'));

//! serve static assets in production

if (process.env.NODE_ENV === 'production') {
  //* set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});


//! Unhandled Rejection ERROR
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err}`)
    console.log('ERROR_Stack:::', err.stack)
    console.log(`Unhandled Rejection, Shutting Down the Server... 😟😟😟😟😟`);
    server.close(() => {
        process.exit(1)
    })
})