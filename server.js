const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

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

  /**
   * Helper function to read a page and inject the menu.html content
   */
  const renderPage = (res, pagePath, replacements = {}) => {
    const menuPath = path.join(__dirname, 'public', 'views', 'core', 'include', 'menu.html');

    // 1. Read the Menu
    fs.readFile(menuPath, 'utf-8', (menuErr, menuHtml) => {
      if (menuErr) {
        res.writeHead(500);
        return res.end('Error loading menu component');
      }

      // 2. Read the requested Page
      fs.readFile(pagePath, 'utf-8', (pageErr, pageHtml) => {
        if (pageErr) {
          res.writeHead(404);
          return res.end('Page not found');
        }

        // 3. Perform injections
        let finalHtml = pageHtml.replace('{{MENU}}', menuHtml);
        
        // Handle any additional dynamic data (like {{name}} in success.html)
        for (const [key, value] of Object.entries(replacements)) {
          finalHtml = finalHtml.replace(`{{${key}}}`, value);
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(finalHtml);
      });
    });
  };

  // --- POST ROUTES ---
  if (req.method === 'POST' && rout === '/submit-form') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const formData = querystring.parse(body);
      const name = formData.name || 'Guest';
      const successPath = path.join(__dirname, 'public', 'views', 'core', 'success.html');
      
      // Render success page with both Menu and Name injection
      renderPage(res, successPath, { name: name });
    });
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