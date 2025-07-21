document.addEventListener('DOMContentLoaded', () => {

    // --- Reveal on Scroll Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });


    // --- Scroll to Top Button ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // --- Hamburger Menu Toggle ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                hamburgerMenu.classList.remove('open');
                navLinks.classList.remove('open');
            }
        });
    });

    // --- Contact Form Submission (AJAX) ---
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission (page reload)

            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);

            try {
                const response = await fetch('/contact_submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' // Flask's request.form expects this
                    },
                    body: formData.toString()
                });

                const result = await response.json(); // Parse JSON response

                if (response.ok && result.success) {
                    alert(result.message); // Show success message from server
                    contactForm.reset(); // Clear the form fields
                } else {
                    alert(`Failed to send message: ${result.message || 'Unknown error'}`); // Show error message from server
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                alert('An error occurred while sending your message. Please try again later.');
            }
        });
    }
});