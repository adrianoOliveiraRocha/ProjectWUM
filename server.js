const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  let rout = req.url.split('?')[0];
  let filePath = '';
  if (req.method === 'POST') {
    if (rout === '/submit-form') {
      filePath = '/views/success.html';
      let body = '';
      // Coletar os dados da requisição
      req.on('data', chunk => {
        body += chunk.toString();
      });      
      // Quando todos os dados forem recebidos
      req.on('end', () => {
        const formData = querystring.parse(body);
        console.log(formData);
        const name = formData.name;
        
        // Ler o arquivo HTML template
        fs.readFile(path.join(__dirname, 'public', filePath), 'utf-8', 
        (err, html) => {
          if (err) {
            res.writeHead(500);
            res.end('Erro ao carregar a página');
            return;
          }          
          // Substituir placeholder pelo nome
          const renderedHtml = html.replace('{{name}}', name);          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        });
      });
    }
  } else if (req.method === 'GET') {
    // Check for specific HTML routes first
    if (rout === '/') {
      filePath = '/views/index.html';
    } else if (rout === '/about') {
      filePath = '/views/about.html';
    } else if (rout === '/form') {
      filePath = '/views/form.html';
    } else {
      // Assume it's a static file (like CSS) and use the request URL directly
      filePath = req.url;
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
      '.jpg': 'image/jpeg',
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
  }
});

server.listen(8000);
