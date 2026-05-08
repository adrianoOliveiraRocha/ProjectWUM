const http = require('http');
const handleRoute = require('./adr_modules/routes');

const server = http.createServer((req, res) => {
  handleRoute(req, res);
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});