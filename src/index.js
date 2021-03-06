import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const mongoose = require('mongoose');

//Import routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const gitHubRoutes = require('./routes/githubOAuth');
const googleRoutes = require('./routes/googleOauth');
const usersRoute = require('./routes/users');
const walletRoute = require('./routes/wallet');

//Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Homepage');  
});

//Route Middlewares
app.use(registerRoute);
app.use(loginRoute);
app.use(gitHubRoutes);
app.use(googleRoutes);
app.use(usersRoute);
app.use(walletRoute);

//Connect to DB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true
 })
 .then(() => {
   console.log('MongoDB Connectedâ€¦')
 })
 .catch(err => console.log(err))

 app.listen(process.env.PORT, () => {
   console.log(`Express app listening on port ${process.env.PORT}`)
  }); 
