I'll show you how to start a web server with Node.js without using Express. Here are several approaches:

## 1. Basic HTTP Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'text/plain');
  
  // Handle different routes
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('Hello World!');
  } else if (req.url === '/about') {
    res.statusCode = 200;
    res.end('About Page');
  } else {
    res.statusCode = 404;
    res.end('Page Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 2. More Advanced Server with Routing

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Route handling
  if (path === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (path === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]));
  } else if (path === '/api/users' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      const userData = JSON.parse(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User created', data: userData }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000);
```

## 3. Serving Static Files

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Remove query parameters
  let filePath = req.url.split('?')[0];
  
  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/views/index.html';
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
```

## 4. Middleware Pattern Implementation

```javascript
const http = require('http');

class MiniApp {
  constructor() {
    this.middlewares = [];
    this.routes = {};
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  get(path, handler) {
    this.routes[`GET ${path}`] = handler;
  }

  post(path, handler) {
    this.routes[`POST ${path}`] = handler;
  }

  handleRequest(req, res) {
    // Run middlewares
    let index = 0;
    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        middleware(req, res, next);
      } else {
        this.handleRoute(req, res);
      }
    };
    next();
  }

  handleRoute(req, res) {
    const routeKey = `${req.method} ${req.url}`;
    const handler = this.routes[routeKey];
    
    if (handler) {
      handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    
    server.listen(port, callback);
  }
}

// Usage example
const app = new MiniApp();

// Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.end('Hello World!');
});

app.get('/api/data', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'API response' }));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

## 5. Package.json Setup

```json
{
  "name": "node-native-server",
  "version": "1.0.0",
  "description": "Node.js server without Express",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "type": "module",
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## Key Points:

1. **http.createServer()** - Core method to create a server
2. **Request Handling** - Use `req.url` and `req.method` for routing
3. **Response Handling** - Use `res.writeHead()`, `res.write()`, `res.end()`
4. **Static Files** - Use `fs` module to serve files
5. **Middleware Pattern** - You can implement your own middleware system

This approach gives you complete control over your server but requires more manual work compared to Express. It's great for learning how web servers work under the hood!