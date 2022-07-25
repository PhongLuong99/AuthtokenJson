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

let refreshTokens = []; 

server.post('/refreshToken', (req, res) =>{
  const refreshToken = req.body.token;
  if(!refreshToken) res.sendStatus(401);
  if(!refreshTokens.includes(refreshToken)) res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign({username : data.username} , process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30s',});
    res.json({accessToken})
    
  });

});

server.post('/login', (req, res) => {
  const data = req.body;
  console.log({data});
  const accessToken = jwt.sign(data , process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30s',});
  const refreshToken = jwt.sign(data , process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
}); 

server.post('/logout', (req, res) =>{
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((refToken) => refToken !== refreshToken);
  res.sendStatus(200);
});




// Start server
const PORT = 5500;

server.listen(PORT, () => {
  console.log(`JSON Server is running ${PORT}`);
});