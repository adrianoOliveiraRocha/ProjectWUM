
const coreRout = (function() {
  return {

    init: function(req, res) {

    },

    get: function(route, req, res, renderPage, contentTypes) {
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
    },

    post: function(rout, req, res, renderPage) {
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
  }
})();

module.exports = coreRout 