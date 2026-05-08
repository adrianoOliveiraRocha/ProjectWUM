const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const renderPage = require('./renderPage');

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const routes = {
  GET: {},
  POST: {}
};

// Smart static file server that checks if file exists in public directory
function serveStatic(res, filePath) {
  // Remove query parameters
  const cleanPath = filePath.split('?')[0];
  
  // Security: Prevent directory traversal attacks
  const safePath = path.normalize(cleanPath).replace(/^(\.\.[\/\\])+/, '');
  
  // Build the full file path
  const fullPath = path.join(__dirname, '..', 'public', safePath);
  
  // Check if file exists
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    
    // Get file extension and content type
    const extname = path.extname(fullPath);
    const contentType = contentTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });
}

function renderHtml(res, filePath, data = {}) {
  const fullPath = path.join(__dirname, '..', 'public', filePath);
  console.log(__dirname)
  console.log(filePath)
  console.log(fullPath)
  renderPage(res, fullPath, data);
}

// HTML Routes
routes.GET['/'] = (req, res) => renderHtml(res, '/views/core/index.html');
routes.GET['/about'] = (req, res) => renderHtml(res, '/views/core/about.html');
routes.GET['/form'] = (req, res) => renderHtml(res, '/views/core/form.html');

// POST Routes
routes.POST['/submit-form'] = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    const formData = querystring.parse(body);
    const name = formData.name || 'Guest';
    renderHtml(res, '/views/core/success.html', { name: name });
  });
};

routes.POST['/your-job'] = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    const formData = querystring.parse(body);
    const job = formData.job || 'Guest';
    renderHtml(res, '/views/core/my-job.html', { job: job });
  });
};

function handleRoute(req, res) {
  const baseURL = `http://${req.headers.host}/`;
  const parsedUrl = new URL(req.url, baseURL);
  const route = parsedUrl.pathname;
  const method = req.method;

  // Check for exact route match first
  if (routes[method] && routes[method][route]) {
    routes[method][route](req, res, parsedUrl);
    return;
  }
  
  // For GET requests, try to serve as static file
  if (method === 'GET') {
    serveStatic(res, route);
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
}

module.exports = handleRoute;