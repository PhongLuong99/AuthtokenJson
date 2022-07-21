const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/ech', (req, res) =>  {
  res.jsonp(req.query)
})


//Convert the local time to another timezone with this JavaScript
function calcTime(offset){
  
  var d = new Date();
  var utc = d.getTime()+(d.getTimezoneOffset()*60000);
  var a = new Date(utc+(3600000*offset))
  return a.toISOString();

}
//var b = Date(Date.now());
//c = b.toString();
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
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

// Use default router
server.use(router);
// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('JSON Server is running');
});