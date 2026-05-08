Looking at your project, **no, you are not strictly following REST principles**. Your current implementation is more of a traditional web application with server-rendered HTML pages. Here's why:

## What you have now (Traditional Web App):

```javascript
// Your current routes
GET  '/'           → Returns HTML page
GET  '/about'      → Returns HTML page  
GET  '/form'       → Returns HTML page
POST '/submit-form' → Processes form, returns HTML page
POST '/your-job'   → Processes form, returns HTML page
```

**Characteristics of your current approach:**
- Server returns HTML pages (not data)
- Form submissions cause full page reloads
- No API endpoints that return JSON
- State is managed on the server with HTML templates

## What REST would look like:

REST (Representational State Transfer) typically involves:
- Resources identified by URLs
- HTTP methods for operations (GET, POST, PUT, DELETE, PATCH)
- Returns data (usually JSON) instead of HTML
- Stateless interactions

Here's how you would convert to REST:

```javascript
// RESTful API endpoints (returns JSON)
GET    '/api/jobs'           → Get all jobs
GET    '/api/jobs/:id'       → Get specific job
POST   '/api/jobs'           → Create new job
PUT    '/api/jobs/:id'       → Update job
DELETE '/api/jobs/:id'       → Delete job
POST   '/api/submit-form'    → Submit form data

// Your HTML pages would be separate
GET  '/'                     → Returns HTML (just for display)
GET  '/about'                → Returns HTML
```

## Example REST implementation for your project:

```javascript
// adr_modules/routes.js - REST version

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {}
};

// REST API endpoints (returns JSON)
routes.GET['/api/jobs'] = (req, res) => {
  const jobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp' },
    { id: 2, title: 'Web Developer', company: 'Web Studio' }
  ];
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(jobs));
};

routes.POST['/api/submit-form'] = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    const formData = querystring.parse(body);
    
    // Return JSON instead of HTML
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Form submitted successfully',
      data: formData 
    }));
  });
};

routes.POST['/api/your-job'] = (req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    const formData = querystring.parse(body);
    
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Job information saved',
      job: formData.job 
    }));
  });
};

// HTML pages for the frontend (these would consume the REST API via JavaScript)
routes.GET['/'] = (req, res) => renderHtml(res, '/views/core/index.html');
routes.GET['/about'] = (req, res) => renderHtml(res, '/views/core/about.html');

// Then your frontend JavaScript would use fetch() to call the API
```

## Your frontend would change to use fetch:

```html
<!-- Your HTML would use JavaScript to call the REST API -->
<script>
  // Instead of form submission causing page reload
  document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(e.target))
    });
    
    const data = await response.json();
    console.log(data); // Handle the JSON response
  });
</script>
```

## Comparison:

| Aspect | Your Current App | REST API |
|--------|-----------------|----------|
| **Returns** | HTML pages | JSON/XML data |
| **State** | Server-side sessions | Stateless |
| **Client** | Browser (full page reloads) | Any client (SPA, mobile, etc.) |
| **Use case** | Traditional website | Web services, APIs |
| **Frontend** | Server-rendered | JavaScript frontend (React, Vue, etc.) |

## Should you use REST?

**Your current approach is fine if:**
- You're building a traditional multi-page website
- You want simple form submissions with page reloads
- SEO is important (server-rendered HTML is good for SEO)
- You don't need a separate mobile app or API consumers

**Switch to REST if:**
- You want to build a Single Page Application (SPA)
- You need to serve both web and mobile clients
- You want to separate frontend and backend development
- You need to provide an API for third-party integrations

Both approaches are valid - it depends on your project requirements!