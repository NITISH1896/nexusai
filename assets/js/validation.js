document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = {
    name: {
      el: document.getElementById('contact-name'),
      errEl: document.getElementById('error-name'),
      validate: (value) => {
        if (!value.trim()) return 'Full Name is required.';
        if (value.trim().length < 2) return 'Full Name must be at least 2 characters.';
        const regex = /^[a-zA-Z\s]{2,50}$/;
        if (!regex.test(value.trim())) return 'Full Name must contain only alphabetical characters.';
        return '';
      }
    },
    email: {
      el: document.getElementById('contact-email'),
      errEl: document.getElementById('error-email'),
      validate: (value) => {
        if (!value.trim()) return 'Business Email is required.';
        // Strict Business Email validation (regex checking general formats)
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(value.trim())) return 'Please enter a valid business email address.';
        
        // Exclude common personal email providers (optional but standard for enterprise SaaS)
        const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
        const domain = value.split('@')[1]?.toLowerCase();
        if (personalDomains.includes(domain)) {
          return 'Please enter a valid company business email (e.g., name@company.com).';
        }
        return '';
      }
    },
    companySize: {
      el: document.getElementById('contact-company-size'),
      errEl: document.getElementById('error-company-size'),
      validate: (value) => {
        if (!value || value === "") return 'Please select your company size.';
        return '';
      }
    },
    message: {
      el: document.getElementById('contact-message'),
      errEl: document.getElementById('error-message'),
      validate: (value) => {
        if (!value.trim()) return 'Message content is required.';
        if (value.trim().length < 20) return `Message is too short. Please add at least ${20 - value.trim().length} more characters.`;
        if (value.trim().length > 1000) return 'Message is too long. Limit is 1000 characters.';
        return '';
      }
    }
  };

  // Helper to show error
  const showError = (fieldKey, errorMsg) => {
    const field = inputs[fieldKey];
    if (field && field.errEl && field.el) {
      if (errorMsg) {
        field.errEl.textContent = errorMsg;
        field.errEl.classList.add('visible');
        field.el.classList.add('input-error');
        field.el.setAttribute('aria-invalid', 'true');
      } else {
        field.errEl.textContent = '';
        field.errEl.classList.remove('visible');
        field.el.classList.remove('input-error');
        field.el.setAttribute('aria-invalid', 'false');
      }
    }
  };

  // Attach blur validation event listeners
  Object.keys(inputs).forEach(key => {
    const field = inputs[key];
    if (field && field.el) {
      field.el.addEventListener('blur', () => {
        const error = field.validate(field.el.value);
        showError(key, error);
      });

      // Clear error formatting when typing starts
      field.el.addEventListener('input', () => {
        if (field.el.classList.contains('input-error')) {
          const error = field.validate(field.el.value);
          if (!error) {
            showError(key, '');
          }
        }
      });
    }
  });

  // Intercept Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Validate all fields
    Object.keys(inputs).forEach(key => {
      const field = inputs[key];
      if (field && field.el) {
        const error = field.validate(field.el.value);
        if (error) {
          showError(key, error);
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      // Focus first error field
      const firstErrorKey = Object.keys(inputs).find(key => inputs[key].validate(inputs[key].el.value) !== '');
      if (firstErrorKey && inputs[firstErrorKey].el) {
        inputs[firstErrorKey].el.focus();
      }
      return;
    }

    // Success State Actions
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Simulate API request submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending Inquiry...
    `;

    setTimeout(() => {
      // Show Success Modal or Toast (Injected alert block)
      const successOverlay = document.createElement('div');
      successOverlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fade-in';
      successOverlay.innerHTML = `
        <div class="glass-panel max-w-md p-8 rounded-2xl mx-4 text-center border border-blue-500/30">
          <div class="w-16 h-16 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Submitted!</h3>
          <p class="text-slate-600 dark:text-gray-400 mb-6">Thank you for your interest in NexusAI. An enterprise workflows architect will contact you at <strong class="text-slate-900 dark:text-white">${inputs.email.el.value.trim()}</strong> within 24 hours.</p>
          <button id="success-close-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            Close Window
          </button>
        </div>
      `;
      document.body.appendChild(successOverlay);
      document.body.classList.add('overflow-hidden');

      // Close modal logic
      document.getElementById('success-close-btn').addEventListener('click', () => {
        successOverlay.remove();
        document.body.classList.remove('overflow-hidden');
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });

    }, 1500);
  });
});
