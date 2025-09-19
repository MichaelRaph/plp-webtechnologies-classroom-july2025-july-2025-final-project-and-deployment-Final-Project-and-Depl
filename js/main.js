// main.js — interactivity: mobile nav, form validation, WhatsApp redirect, small animations
document.addEventListener('DOMContentLoaded', function () {
  // Populate current year(s)
  const yearEls = [document.getElementById('year'), document.getElementById('year-2'), document.getElementById('year-3'), document.getElementById('year-4')];
  yearEls.forEach(el => { if (el) el.textContent = new Date().getFullYear(); });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  // Add "active" class to nav links based on current URL
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.href === window.location.href || link.href === window.location.href.split('#')[0]) {
      link.classList.add('active');
    }
  });

  // Simple reveal animation using IntersectionObserver
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.card, .service-card, .booking-form, .contact-card').forEach(el => observer.observe(el));

  // Booking form validation and WhatsApp redirect
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    // Clinic WhatsApp number (international format WITHOUT + or leading 0): Nigeria example 2349117371171
    const clinicWhatsapp = '2349117371171';

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const complaint = document.getElementById('complaint').value.trim();
      const errorBox = document.getElementById('form-error');

      // Validation rules
      const nameRegex = /^[A-Za-z\s]+$/; // alphabet and spaces only
      const phoneRegex = /^\d{7,15}$/; // digits only, 7-15 digits

      if (!name || !nameRegex.test(name)) {
        showError('Please enter a valid name (letters and spaces only).');
        return;
      }
      if (!phone || !phoneRegex.test(phone)) {
        showError('Please enter a valid phone number (digits only, 7–15 digits).');
        return;
      }
      if (!complaint) {
        showError('Please describe your complaint or request.');
        return;
      }

      // Compose a message for WhatsApp
      const message = `Hello Smile Well,\n\nMy name is ${name}.\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nComplaint: ${complaint}\n\nI would like to book an appointment.`;

      // Encode and redirect to WhatsApp
      const waUrl = `https://wa.me/${clinicWhatsapp}?text=${encodeURIComponent(message)}`;

      // Small success UX: open in new tab
      window.open(waUrl, '_blank');

      // Optionally show a small confirmation on the page
      bookingForm.reset();
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.style.color = 'green';
        errorBox.textContent = 'Redirecting to WhatsApp to confirm your appointment…';
        setTimeout(() => { errorBox.hidden = true; }, 4000);
      }
    });

    function showError(msg) {
      const errorBox = document.getElementById('form-error');
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.style.color = '#b00020';
        errorBox.textContent = msg;
      } else {
        alert(msg);
      }
    }
  }
});
