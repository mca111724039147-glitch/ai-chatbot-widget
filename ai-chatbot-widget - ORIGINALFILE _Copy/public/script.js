// Global variables
let selectedPlan = '';
let selectedPrice = 0;

// Dashboard tab switching
function showDashboardTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Hide all content
  document.getElementById('flowbuilder-content').style.display = 'none';
  document.getElementById('analytics-content').style.display = 'none';
  document.getElementById('knowledge-content').style.display = 'none';
  
  // Show selected content
  if (tab === 'flowbuilder') {
    document.getElementById('flowbuilder-content').style.display = 'grid';
  } else if (tab === 'analytics') {
    document.getElementById('analytics-content').style.display = 'grid';
  } else if (tab === 'knowledge') {
    document.getElementById('knowledge-content').style.display = 'grid';
  }
}

// Smooth scroll functions
function scrollToPricing() {
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
}

function scrollToDemo() {
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

// FAQ Toggle
function toggleFaq(element) {
  const faqItem = element.parentElement;
  const isActive = faqItem.classList.contains('active');
  
  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add('active');
  }
}

// Purchase Modal
function openPurchaseModal(plan, price) {
  selectedPlan = plan;
  selectedPrice = price;
  
  // Update Plan Name and Price in the new HTML template
  const planNameEl = document.getElementById('modalPlanName');
  if (planNameEl) planNameEl.textContent = plan + ' Plan';
  
  const priceEl = document.getElementById('modalPrice');
  if (priceEl) priceEl.textContent = '₹' + price;
  
  // Show Modal (uses inline styles in the new design)
  const modal = document.getElementById('purchaseModal');
  if (modal) modal.style.display = 'flex';
  
  document.body.style.overflow = 'hidden';
  
  // Reset fields
  const pwEl = document.getElementById('userPassword');
  if (pwEl) {
    pwEl.value = '';
    updatePasswordStrength('');
  }
}
function closePurchaseModal() {
  document.getElementById('purchaseModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function togglePasswordVisibility() {
  const input = document.getElementById('userPassword');
  const btn = document.getElementById('eyeBtn');
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '&#128064;';
    btn.title = 'Hide password';
  } else {
    input.type = 'password';
    btn.innerHTML = '&#128065;';
    btn.title = 'Show password';
  }
}

// Password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  return requirements;
}

function updatePasswordRequirements(password) {
  const requirements = validatePassword(password);
  
  // Update each requirement indicator
  updateRequirement('req-length', requirements.length);
  updateRequirement('req-uppercase', requirements.uppercase);
  updateRequirement('req-lowercase', requirements.lowercase);
  updateRequirement('req-number', requirements.number);
  updateRequirement('req-special', requirements.special);
  
  return Object.values(requirements).every(val => val === true);
}

function updateRequirement(id, isValid) {
  const element = document.getElementById(id);
  const icon = element.querySelector('.req-icon');
  
  if (isValid) {
    element.classList.add('valid');
    icon.textContent = '✓';
  } else {
    element.classList.remove('valid');
    icon.textContent = '✗';
  }
}

function resetPasswordValidation() {
  ['req-length', 'req-uppercase', 'req-lowercase', 'req-number', 'req-special'].forEach(id => {
    updateRequirement(id, false);
  });
}

// ============================
// PASSWORD STRENGTH VALIDATION
// ============================

function checkPasswordRules(password) {
  return {
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    lower:   /[a-z]/.test(password),
    number:  /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)
  };
}

// Handle Purchase Form - validate locally, then show payment popup
async function handlePurchase(event) {
  event.preventDefault();

  const companyName = document.getElementById('companyName').value.trim();
  const userEmail = document.getElementById('userEmail').value.trim();
  const userPhone = document.getElementById('userPhone').value.trim();
  const userPassword = document.getElementById('userPassword').value;

  // Validations
  if (!companyName) { alert('Please enter your company name.'); return; }
  if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) { alert('Please enter a valid email address.'); return; }
  if (!userPhone) { alert('Please enter your phone number.'); return; }

  // Full password policy check
  const hasMinLength = userPassword.length >= 8;
  const hasNumber = /\d/.test(userPassword);
  const hasSpecial = /[!@#$%^&*]/.test(userPassword);
  if (!hasMinLength) { alert('Password must be at least 8 characters long.'); return; }

  window._pendingPurchase = {
    company_name: companyName,
    email: userEmail,
    phone: userPhone,
    password: userPassword,
    plan_id: selectedPlan === 'Basic' ? 1 : selectedPlan === 'Standard' ? 2 : 3
  };

  const submitBtn = document.getElementById('submitBtn');
  const loadingOverlay = document.getElementById('loading-overlay');
  
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  if (submitBtn) submitBtn.disabled = true;

  // Simulate quick backend registration before showing Custom Mock UI
  setTimeout(() => {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
    
    document.getElementById('purchaseModal').style.display = 'none';
    openPaymentModal();
  }, 1000);
}
function showSuccessModal(pendingData) {
  closeRazorpayModal();
  
  // Set dynamic data
  const emailEl = document.getElementById('successEmail');
  if (emailEl) emailEl.textContent = pendingData.email;
  
  const planEl = document.getElementById('successPlanName');
  if (planEl) {
    let pName = 'Basic';
    if (pendingData.plan_id == 2) pName = 'Pro';
    if (pendingData.plan_id == 3) pName = 'Premium';
    planEl.textContent = pName + ' Plan';
  }
  
  window._pendingPurchase = null;
  document.getElementById('rzpSuccessOverlay').style.display = 'flex';
}

function closeSuccessModal() {
  document.getElementById('rzpSuccessOverlay').style.display = 'none';
  window.location.href = '/';
}

function goToDashboard() {
  window.location.href = '/admin/login.html';
}

// --- Password Strength ---
function updatePasswordStrength(val) {
  const p1 = document.getElementById('pw-strength-1');
  const p2 = document.getElementById('pw-strength-2');
  const p3 = document.getElementById('pw-strength-3');
  
  if (!p1 || !p2 || !p3) return;
  
  const hasMinLength = val.length >= 8;
  const hasNumber = /\d/.test(val);
  const hasSpecial = /[!@#$%^&*]/.test(val);
  
  let score = 0;
  if (val.length > 0) score = 1;
  if (hasMinLength) score = 2;
  if (hasMinLength && (hasNumber || hasSpecial)) score = 3;
  
  // Colors: red, yellow, green
  const c1 = score >= 1 ? '#EF4444' : 'rgba(255,255,255,0.1)';
  const c2 = score >= 2 ? '#F59E0B' : 'rgba(255,255,255,0.1)';
  const c3 = score >= 3 ? '#10B981' : 'rgba(255,255,255,0.1)';
  
  if (score === 3) {
    p1.style.background = '#10B981';
    p2.style.background = '#10B981';
    p3.style.background = '#10B981';
  } else {
    p1.style.background = c1;
    p2.style.background = c2;
    p3.style.background = c3;
  }
}
// --- OTP Modal Logic (Pay Later) ---
function requestOtpModal() {
  const phone = window._pendingPurchase ? window._pendingPurchase.phone : '+918008463405';
  const otpPhoneEl = document.getElementById('rzpOtpPhone');
  if (otpPhoneEl) otpPhoneEl.textContent = phone;
  
  const otpModal = document.getElementById('rzpOtpOverlay');
  if (otpModal) {
    otpModal.style.display = 'flex';
    // Focus first input automatically
    const firstInput = otpModal.querySelector('.rzp-otp-input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

function closeOtpModal() {
  const otpModal = document.getElementById('rzpOtpOverlay');
  if (otpModal) otpModal.style.display = 'none';
}

function moveToNext(current, event) {
  if (event.key === 'Backspace' && current.value === '') {
    if (current.previousElementSibling) {
      current.previousElementSibling.focus();
    }
  } else if (current.value !== '') {
    if (current.nextElementSibling) {
      current.nextElementSibling.focus();
    }
  }
}

function confirmOtp() {
  // Simulate OTP verification success
  const btn = document.querySelector('#rzpOtpOverlay .rzp-exit-btn-solid');
  if (btn) btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div>';
  
  setTimeout(() => {
    closeOtpModal();
    if (btn) btn.innerHTML = 'Continue';
    // Proceed with payment
    rzpContinue();
  }, 1000);
}
// --- Payment Modal & Exit Logic ---
function openPaymentModal() {
  const overlay = document.getElementById('rzpOverlay');
  if (overlay) overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  if (typeof selectedPrice !== 'undefined' && selectedPrice) {
    const amountEl = document.getElementById('rzpAmount');
    if (amountEl) amountEl.innerHTML = '&#8377;' + selectedPrice;
  }
}

function requestCloseRazorpayModal() {
  const exitOverlay = document.getElementById('rzpExitOverlay');
  if (exitOverlay) exitOverlay.style.display = 'flex';
}

function closeExitModal() {
  const exitOverlay = document.getElementById('rzpExitOverlay');
  if (exitOverlay) exitOverlay.style.display = 'none';
}

function confirmExit() {
  const exitOverlay = document.getElementById('rzpExitOverlay');
  if (exitOverlay) exitOverlay.style.display = 'none';
  
  const rzpOverlay = document.getElementById('rzpOverlay');
  if (rzpOverlay) rzpOverlay.classList.remove('show');
  
  document.body.style.overflow = 'auto';
}

// Ensure clicking on the exit overlay background closes it
window.addEventListener('click', function(e) {
  const exitOverlay = document.getElementById('rzpExitOverlay');
  if (e.target === exitOverlay) {
    closeExitModal();
  }
});
// --- Tab Switching Logic ---
function selectPayment(method, element) {
  // Update active state in sidebar
  const items = document.querySelectorAll('.rzp-sidebar-item');
  items.forEach(item => item.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }
  
  // Hide all tabs
  const tabs = document.querySelectorAll('.rzp-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  
  // Show selected tab
  const targetTab = document.getElementById('rzp-tab-' + method);
  if (targetTab) {
    targetTab.style.display = 'block';
  }
}

function closeRazorpayModal() {
  const overlay = document.getElementById('rzpOverlay');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// --- Payment Processing Logic ---

async function rzpContinue() {
  if (!window._pendingPurchase) return;
  const pendingData = window._pendingPurchase;
  
  const continueBtn = document.querySelector('.rzp-cards-continue');
  if (continueBtn) {
    continueBtn.disabled = true;
    continueBtn.innerHTML = 'Processing...';
  }

  try {
    const orderRes = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingData)
    });
    const orderData = await orderRes.json();
    
    if (orderData.error) {
      alert('Error creating order: ' + orderData.error);
      if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.innerHTML = 'Continue';
      }
      return;
    }

    const options = {
      key: orderData.key || orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'GAdigital Solution',
      description: pendingData.plan_id == 2 ? 'Pro Plan' : (pendingData.plan_id == 3 ? 'Premium Plan' : 'Basic Plan'),
      order_id: orderData.order_id,
      prefill: {
        name: pendingData.company_name,
        email: pendingData.email,
        contact: pendingData.phone
      },
      theme: { color: '#4F46E5' },
      modal: {
        ondismiss: function() {
          const continueBtn = document.querySelector('.rzp-cards-continue');
          if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.innerHTML = 'Continue';
          }
        }
      },
      handler: async function (response) {
        const verifyPayload = {
          ...pendingData,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        };
        
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verifyPayload)
          });
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok && verifyData.success) {
            document.getElementById('rzpOverlay').classList.remove('show');
            showSuccessModal(pendingData);
          } else {
            alert('Payment Failed: ' + (verifyData.error || 'Unknown error'));
            if (continueBtn) { continueBtn.disabled = false; continueBtn.innerHTML = 'Continue'; }
          }
        } catch(err) {
          console.error(err);
          alert('Error during verification.');
          if (continueBtn) { continueBtn.disabled = false; continueBtn.innerHTML = 'Continue'; }
        }
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      console.log('Payment failed:', response.error);
      alert('Payment could not be completed via Razorpay.\nReason: ' + response.error.description);
      if (continueBtn) { continueBtn.disabled = false; continueBtn.innerHTML = 'Continue'; }
    });
    rzp.open();
    
  } catch (err) {
    console.error('Purchase error:', err);
    alert('Failed to connect to the server.');
    if (continueBtn) {
      continueBtn.disabled = false;
      continueBtn.innerHTML = 'Continue';
    }
  }
}