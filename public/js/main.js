// Toggle user dropdown
document.querySelector('.user-avatar')?.addEventListener('click', function() {
    document.querySelector('.user-dropdown').classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenu && userDropdown && !userMenu.contains(event.target) && userDropdown.classList.contains('active')) {
        userDropdown.classList.remove('active');
    }
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
});

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if it doesn't exist
            if (!input.nextElementSibling?.classList.contains('error-message')) {
                const errorMessage = document.createElement('span');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMessage, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            const errorMessage = input.nextElementSibling;
            if (errorMessage?.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    });

    return isValid;
}

// Add form validation to all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
        }
    });
});

// Flash message auto-hide
document.querySelectorAll('.flash-message').forEach(message => {
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
});

// Image gallery functionality
function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');
    const mainImage = document.querySelector('.main-image img');

    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// Initialize image gallery if it exists
initImageGallery();

// Profile Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Profile Navigation
    const profileNav = document.querySelector('.profile-nav');
    const profileSections = document.querySelectorAll('.profile-section');
    
    if (profileNav) {
        profileNav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                
                // Remove active class from all links and sections
                profileNav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                profileSections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked link
                e.target.classList.add('active');
                
                // Show corresponding section
                const targetId = e.target.getAttribute('href').substring(1);
                document.getElementById(targetId).classList.add('active');
            }
        });
    }

    // Avatar Upload
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('avatar', file);
                    
                    fetch('/user/avatar', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Update avatar image
                            const avatarImg = document.querySelector('.profile-avatar img');
                            avatarImg.src = data.avatarUrl + '?t=' + new Date().getTime();
                            
                            // Show success message
                            showFlashMessage('Avatar updated successfully', 'success');
                        } else {
                            showFlashMessage('Failed to update avatar', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showFlashMessage('An error occurred while updating avatar', 'error');
                    });
                }
            };
            
            input.click();
        });
    }

    // Form Validation
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!name || !email) {
                showFlashMessage('Please fill in all required fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFlashMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Submit form
            this.submit();
        });
    }

    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Only validate password fields if any of them are filled
            if (currentPassword || newPassword || confirmPassword) {
                if (!currentPassword) {
                    showFlashMessage('Please enter your current password', 'error');
                    return;
                }
                
                if (!newPassword) {
                    showFlashMessage('Please enter a new password', 'error');
                    return;
                }
                
                if (newPassword.length < 8) {
                    showFlashMessage('Password must be at least 8 characters long', 'error');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showFlashMessage('New passwords do not match', 'error');
                    return;
                }
            }
            
            // Submit form
            this.submit();
        });
    }
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Venue Listing Page
const venueFilters = document.querySelector('.venue-filters');
if (venueFilters) {
    const filterForm = venueFilters.querySelector('form');
    const sortSelect = document.querySelector('#sort-options');
    
    // Handle sort change
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            filterForm.submit();
        });
    }
    
    // Handle filter form submission
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        const searchParams = new URLSearchParams();
        
        for (const [key, value] of formData.entries()) {
            if (value) {
                searchParams.append(key, value);
            }
        }
        
        window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
    });
}

// Venue Details Page
const venueDetails = document.querySelector('.venue-details-page');
if (venueDetails) {
    // Image Gallery
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const newSrc = thumb.querySelector('img').src;
            mainImage.src = newSrc;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Booking Form
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const dateInput = bookingForm.querySelector('input[type="date"]');
        const guestsInput = bookingForm.querySelector('input[type="number"]');
        const durationInput = bookingForm.querySelector('select[name="duration"]');
        const basePrice = parseFloat(bookingForm.dataset.basePrice);
        
        // Calculate total price
        const calculateTotal = () => {
            const guests = parseInt(guestsInput.value) || 0;
            const duration = parseInt(durationInput.value) || 1;
            const total = basePrice * guests * duration;
            
            // Update price breakdown
            document.querySelector('.base-price').textContent = `$${basePrice.toFixed(2)}`;
            document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
        };
        
        // Add event listeners for price calculation
        guestsInput.addEventListener('input', calculateTotal);
        durationInput.addEventListener('change', calculateTotal);
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Handle form submission
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (!dateInput.value) {
                showError('Please select a date');
                return;
            }
            
            if (!guestsInput.value || guestsInput.value < 1) {
                showError('Please enter number of guests');
                return;
            }
            
            // Submit form
            const formData = new FormData(bookingForm);
            fetch('/bookings/create', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = `/bookings/${data.bookingId}`;
                } else {
                    showError(data.message);
                }
            })
            .catch(error => {
                showError('An error occurred. Please try again.');
            });
        });
    }
    
    // Reviews
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        const ratingInputs = reviewForm.querySelectorAll('input[name="rating"]');
        const ratingDisplay = reviewForm.querySelector('.rating-display');
        
        ratingInputs.forEach(input => {
            input.addEventListener('change', () => {
                const rating = input.value;
                ratingDisplay.innerHTML = '';
                
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('i');
                    star.className = `fas fa-star ${i <= rating ? 'active' : ''}`;
                    ratingDisplay.appendChild(star);
                }
            });
        });
        
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            const rating = reviewForm.querySelector('input[name="rating"]:checked');
            const comment = reviewForm.querySelector('textarea[name="comment"]');
            
            if (!rating) {
                showError('Please select a rating');
                return;
            }
            
            if (!comment.value.trim()) {
                showError('Please enter your review');
                return;
            }
            
            // Submit form
            const formData = new FormData(reviewForm);
            fetch('/reviews/create', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess('Review submitted successfully');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showError(data.message);
                }
            })
            .catch(error => {
                showError('An error occurred. Please try again.');
            });
        });
    }
}

// Helper function to show error messages
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    
    document.querySelector('.flash-messages').appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Helper function to show success messages
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    
    document.querySelector('.flash-messages').appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Owner Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize revenue chart if it exists
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        const ctx = revenueChart.getContext('2d');
        let chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenue',
                    data: [],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Handle period changes
        const periodButtons = document.querySelectorAll('.chart-period .btn');
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                const period = this.dataset.period;
                
                // Update active state
                periodButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Fetch new data
                fetch(`/api/owner/revenue?period=${period}`)
                    .then(response => response.json())
                    .then(data => {
                        chart.data.labels = data.labels;
                        chart.data.datasets[0].data = data.values;
                        chart.update();
                    })
                    .catch(error => {
                        console.error('Error fetching revenue data:', error);
                        showError('Failed to load revenue data');
                    });
            });
        });

        // Trigger initial data load
        periodButtons[0].click();
    }

    // Handle booking status updates
    const statusButtons = document.querySelectorAll('.booking-status-btn');
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.dataset.bookingId;
            const newStatus = this.dataset.status;
            
            fetch(`/api/owner/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update UI
                    const statusElement = document.querySelector(`[data-booking-id="${bookingId}"] .booking-status`);
                    statusElement.className = `booking-status ${newStatus}`;
                    statusElement.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                    
                    showSuccess('Booking status updated successfully');
                } else {
                    showError(data.message || 'Failed to update booking status');
                }
            })
            .catch(error => {
                console.error('Error updating booking status:', error);
                showError('Failed to update booking status');
            });
        });
    });

    // Handle venue actions
    const venueActionButtons = document.querySelectorAll('.venue-action-btn');
    venueActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const venueId = this.dataset.venueId;
            const action = this.dataset.action;
            
            if (action === 'edit') {
                window.location.href = `/owner/venues/${venueId}/edit`;
            } else if (action === 'delete') {
                if (confirm('Are you sure you want to delete this venue?')) {
                    fetch(`/api/owner/venues/${venueId}`, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Remove venue from UI
                            const venueElement = document.querySelector(`[data-venue-id="${venueId}"]`);
                            venueElement.remove();
                            showSuccess('Venue deleted successfully');
                        } else {
                            showError(data.message || 'Failed to delete venue');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting venue:', error);
                        showError('Failed to delete venue');
                    });
                }
            }
        });
    });

    // Handle review responses
    const reviewResponseForms = document.querySelectorAll('.review-response-form');
    reviewResponseForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const reviewId = this.dataset.reviewId;
            const response = this.querySelector('textarea').value;
            
            fetch(`/api/owner/reviews/${reviewId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ response })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update UI
                    const responseElement = document.querySelector(`[data-review-id="${reviewId}"] .review-response`);
                    responseElement.textContent = response;
                    responseElement.style.display = 'block';
                    this.style.display = 'none';
                    
                    showSuccess('Response added successfully');
                } else {
                    showError(data.message || 'Failed to add response');
                }
            })
            .catch(error => {
                console.error('Error adding review response:', error);
                showError('Failed to add response');
            });
        });
    });
}); 