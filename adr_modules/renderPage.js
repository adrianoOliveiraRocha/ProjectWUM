const path = require('path');
const fs = require('fs');

/**
 * Helper function to read a page and inject the menu.html content
 */

const renderPage = (res, pagePath, replacements = {}) => {
    const menuPath = path.join(__dirname, '../', 'public', 'views', 'core', 'include', 'menu.html');

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

  module.exports = renderPage;