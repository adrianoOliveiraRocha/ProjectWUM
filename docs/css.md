# Pure CSS Menu Implementation

I'll create a clean, responsive menu using only CSS (no frameworks) with hover effects and a mobile-friendly design.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pure CSS Menu</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }
        
        /* Header and navigation styles */
        header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            color: white;
            font-size: 1.8rem;
            font-weight: 700;
            text-decoration: none;
            padding: 15px 0;
        }
        
        /* Main navigation */
        .nav-menu {
            display: flex;
            list-style: none;
        }
        
        .nav-item {
            position: relative;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            padding: 20px 15px;
            display: block;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        /* Dropdown menu */
        .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            min-width: 200px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .dropdown-item {
            display: block;
            padding: 12px 15px;
            color: #333;
            text-decoration: none;
            border-bottom: 1px solid #f0f0f0;
            transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
            background-color: #f5f7fa;
            color: #6a11cb;
        }
        
        .nav-item:hover .dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        /* Mobile menu toggle */
        .menu-toggle {
            display: none;
            flex-direction: column;
            cursor: pointer;
            padding: 5px;
        }
        
        .menu-toggle span {
            width: 25px;
            height: 3px;
            background-color: white;
            margin: 3px 0;
            transition: 0.3s;
        }
        
        /* Content section */
        .content {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        
        .content h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .content p {
            margin-bottom: 15px;
            color: #555;
        }
        
        /* Mobile responsiveness */
        @media screen and (max-width: 768px) {
            .menu-toggle {
                display: flex;
            }
            
            .nav-menu {
                position: fixed;
                top: 60px;
                left: -100%;
                width: 80%;
                height: calc(100vh - 60px);
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                flex-direction: column;
                transition: all 0.5s ease;
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-item {
                width: 100%;
            }
            
            .nav-link {
                padding: 15px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .dropdown {
                position: static;
                opacity: 1;
                visibility: visible;
                transform: none;
                box-shadow: none;
                background-color: rgba(0, 0, 0, 0.1);
                display: none;
                width: 100%;
            }
            
            .dropdown.active {
                display: block;
            }
            
            .dropdown-item {
                color: white;
                padding-left: 40px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .nav-item:hover .dropdown {
                display: none;
            }
        }
        
        /* Animation for menu toggle */
        .menu-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    </style>
</head>
<body>
    <header>
        <div class="nav-container">
            <a href="#" class="logo">CSSMenu</a>
            
            <div class="menu-toggle" id="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="#" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Services</a>
                    <div class="dropdown">
                        <a href="#" class="dropdown-item">Web Design</a>
                        <a href="#" class="dropdown-item">Development</a>
                        <a href="#" class="dropdown-item">SEO</a>
                        <a href="#" class="dropdown-item">Marketing</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Portfolio</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Contact</a>
                </li>
            </ul>
        </div>
    </header>
    
    <section class="content">
        <h1>Pure CSS Menu Example</h1>
        <p>This menu is built using only HTML and CSS - no JavaScript or CSS frameworks.</p>
        <p>Features include:</p>
        <ul>
            <li>Responsive design that works on all screen sizes</li>
            <li>Smooth hover effects and transitions</li>
            <li>Dropdown menus on desktop</li>
            <li>Mobile-friendly hamburger menu</li>
            <li>Clean, modern design</li>
        </ul>
        <p>Resize your browser window to see the mobile menu in action!</p>
    </section>

    <script>
        // Simple JavaScript for mobile menu toggle (optional enhancement)
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            const navMenu = document.querySelector('.nav-menu');
            
            mobileMenu.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            // Mobile dropdown toggle
            const dropdownItems = document.querySelectorAll('.nav-item');
            dropdownItems.forEach(item => {
                if (item.querySelector('.dropdown')) {
                    const link = item.querySelector('.nav-link');
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            e.preventDefault();
                            const dropdown = this.nextElementSibling;
                            dropdown.classList.toggle('active');
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>
```

## Key Features

1. **Pure CSS Implementation** - No frameworks or libraries used
2. **Responsive Design** - Adapts to different screen sizes
3. **Dropdown Menus** - Hover-activated on desktop, click-activated on mobile
4. **Smooth Animations** - CSS transitions for a polished feel
5. **Mobile-Friendly** - Hamburger menu for smaller screens
6. **Clean Aesthetics** - Modern gradient background and typography

The menu includes a JavaScript enhancement for mobile functionality, but the core styling and desktop interactions work with CSS alone. You can remove the JavaScript if you prefer a CSS-only solution, though mobile navigation would be limited.