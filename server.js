const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const renderPage = require('./adr_modules/renderPage');


const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const parsedUrl = new URL(req.url, baseURL);
  const rout = parsedUrl.pathname;

  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };

  // --- POST ROUTES ---
  if (req.method === 'POST') {
    if(rout === '/submit-form') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        const formData = querystring.parse(body);
        const name = formData.name || 'Guest';
        const successPath = path.join(__dirname, 'public', 'views', 'core', 'success.html');
        
        // Render success page with both Menu and Name injection
        renderPage(res, successPath, { name: name });
      });
    } else if(rout === '/your-job') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        const formData = querystring.parse(body);
        const job = formData.job || 'Guest';
        const successPath = path.join(__dirname, 'public', 'views', 'core', 'my-job.html');
        
        // Render success page with both Menu and Name injection
        renderPage(res, successPath, { job: job });
      });
    }  
  } 
  
  // --- GET ROUTES ---
  else if (req.method === 'GET') {
    let filePath = '';
    let isHtmlRoute = false;

    // Route Mapping
    if (rout === '/') {
      filePath = '/views/core/index.html';
      isHtmlRoute = true;
    } else if (rout === '/about') {
      filePath = '/views/core/about.html';
      isHtmlRoute = true;
    } else if (rout === '/form') {
      filePath = '/views/core/form.html';
      isHtmlRoute = true;
    } else {
      filePath = rout; // Static assets (css, js, images)
    }

    const fullPath = path.join(__dirname, 'public', filePath);

    if (isHtmlRoute) {
      renderPage(res, fullPath);
    } else {
      // Standard static file serving
      const extname = path.extname(fullPath);
      const contentType = contentTypes[extname] || 'text/plain';

      fs.readFile(fullPath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('File not found');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

server.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});