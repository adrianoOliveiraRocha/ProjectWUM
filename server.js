const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Remove query parameters
  let filePath = req.url.split('?')[0];
  
  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/views/index.html';
  } else if(filePath === '/about') {
    filePath = '/views/about.html';
  }
  
  const fullPath = path.join(__dirname, 'public', filePath);
  const extname = path.extname(fullPath);
  
  // Content type mapping
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      const contentType = contentTypes[extname] || 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(3000);