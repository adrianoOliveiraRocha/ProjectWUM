const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  // Se for uma requisição POST
  if (req.method === 'POST') {
    // /submit-form
    if (req.url === '/submit-form') {
      let body = '';
      // Coletar os dados da requisição
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      // Quando todos os dados forem recebidos
      req.on('end', () => {
        const formData = querystring.parse(body);
        const name = formData.name;
        
        // Ler o arquivo HTML template
        fs.readFile(path.join(__dirname, 'public', 'views', 'success.html'), 'utf8', (err, html) => {
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
    // Restante do código para servir arquivos estáticos (GET)
    // Remove query parameters
    let filePath = req.url.split('?')[0];
    
    // Default to index.html for root
    if (filePath === '/') {
      filePath = '/views/index.html';
    } else if (filePath === '/about') {
      filePath = '/views/about.html';
    } else if (filePath === '/form') {
      filePath = '/views/form.html';
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
  }
});

server.listen(3000);