// Simple JavaScript for mobile menu toggle (optional enhancement)
console.log("Simple JavaScript for mobile menu toggle (optional enhancement)")
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