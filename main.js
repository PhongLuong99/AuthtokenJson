import express from 'express';
import dotenv from 'dotenv';
import  jwt  from 'jsonwebtoken';



dotenv.config();

//const jsonServer = require('json-server')
//const server = jsonServer.create()
const server = express();
//const router = jsonServer.router('db.json')
//const middlewares = jsonServer.defaults()

server.use(express.json());
// Set default middlewares (logger, static, cors and no-cache)
//server.use(middlewares)


// Add custom routes before JSON Server router
const user = [
  {
    id: 1,
    name : 'phong',
    descprision: 'ngon',
    internet: 'Capital'

  }
];


server.get('/events',authenToken, (req, res, next) =>  {
  res.json({ users: user})
  
});


server.get ('/users', (req, res) => {
  res.jsonp({status: 'success'})
  
});




function authenToken(req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  const token = authorizationHeader.split(' ')[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    next();
  });
}
//Convert the local time to another timezone with this JavaScript
function calcTime(offset){
  
  var d = new Date();
  var utc = d.getTime()+(d.getTimezoneOffset()*60000);
  var a = new Date(utc+(3600000*offset))
  return a.toISOString();

}

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
//server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    //req.body.createdAt = Date.now()
    req.body.updatedAt = calcTime('+7')

  }
  if(req.method === 'PUT')  {

    req.body.time = calcTime('+7')
  }
  // Continue to JSON Server router
  next()
})



// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`JSON Server is running ${PORT}`);
});