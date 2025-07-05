/**
 * Job Finder Web Application
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Job search form validation
    const jobSearchForm = document.querySelector('.job-search-form');
    if (jobSearchForm) {
        jobSearchForm.addEventListener('submit', function (e) {
            const keywordInput = this.querySelector('input[name="keyword"]');
            if (keywordInput.value.trim() === '' && this.querySelector('select[name="location"]').value === '') {
                e.preventDefault();
                showAlert('Please enter a keyword or select a location', 'warning');
            }
        });
    }

    // File upload preview
    const resumeUpload = document.getElementById('resume');
    const fileLabel = document.querySelector('.custom-file-label');

    if (resumeUpload && fileLabel) {
        resumeUpload.addEventListener('change', function () {
            const fileName = this.files[0] ? this.files[0].name : 'Choose file';
            fileLabel.textContent = fileName;

            // Validate file type
            const fileType = this.files[0].type;
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!validTypes.includes(fileType)) {
                showAlert('Please upload a PDF or DOCX file only', 'danger');
                this.value = '';
                fileLabel.textContent = 'Choose file';
            }
        });
    }

    // Password strength meter
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('password-strength-meter');
    const strengthText = document.getElementById('password-strength-text');

    if (passwordInput && strengthMeter && strengthText) {
        passwordInput.addEventListener('input', function () {
            const strength = calculatePasswordStrength(this.value);

            // Update the strength meter
            strengthMeter.value = strength.score;

            // Update the text
            let text = '';
            let className = '';

            switch (strength.score) {
                case 0:
                    text = 'Very weak';
                    className = 'text-danger';
                    break;
                case 1:
                    text = 'Weak';
                    className = 'text-danger';
                    break;
                case 2:
                    text = 'Fair';
                    className = 'text-warning';
                    break;
                case 3:
                    text = 'Good';
                    className = 'text-info';
                    break;
                case 4:
                    text = 'Strong';
                    className = 'text-success';
                    break;
            }

            strengthText.textContent = text;
            strengthText.className = className;

            // Show suggestions if needed
            if (strength.score < 3) {
                const suggestions = document.getElementById('password-suggestions');
                if (suggestions) {
                    suggestions.innerHTML = strength.suggestions.map(s => `<li>${s}</li>`).join('');
                    suggestions.classList.remove('d-none');
                }
            } else {
                const suggestions = document.getElementById('password-suggestions');
                if (suggestions) {
                    suggestions.classList.add('d-none');
                }
            }
        });
    }

    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Bookmark job functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-job');

    if (bookmarkButtons.length > 0) {
        bookmarkButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const jobId = this.dataset.jobId;
                const isLoggedIn = this.dataset.isLoggedIn === 'true';

                if (!isLoggedIn) {
                    window.location.href = 'login.php?redirect=jobs.php';
                    return;
                }

                fetch('seeker/bookmark-job.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `job_id=${jobId}&csrf_token=${document.querySelector('meta[name="csrf-token"]').content}`
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            this.innerHTML = data.bookmarked ?
                                '<i class="fas fa-bookmark"></i>' :
                                '<i class="far fa-bookmark"></i>';

                            showAlert(data.message, 'success');
                        } else {
                            showAlert(data.message, 'danger');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showAlert('An error occurred. Please try again.', 'danger');
                    });
            });
        });
    }

    // Apply for job functionality
    const applyForm = document.getElementById('apply-form');

    if (applyForm) {
        applyForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch('seeker/apply-job.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showAlert(data.message, 'success');

                        // Update UI to show applied
                        const applyButton = document.getElementById('apply-button');
                        if (applyButton) {
                            applyButton.textContent = 'Applied';
                            applyButton.classList.remove('btn-primary');
                            applyButton.classList.add('btn-success');
                            applyButton.disabled = true;
                        }

                        // Close modal if exists
                        const modal = bootstrap.Modal.getInstance(document.getElementById('apply-modal'));
                        if (modal) {
                            modal.hide();
                        }
                    } else {
                        showAlert(data.message, 'danger');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert('An error occurred. Please try again.', 'danger');
                });
        });
    }

    // Delete confirmation
    const deleteButtons = document.querySelectorAll('.delete-confirm');

    if (deleteButtons.length > 0) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        });
    }

    // Helper functions
    function showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');

        if (!alertContainer) {
            // Create alert container if it doesn't exist
            const container = document.createElement('div');
            container.id = 'alert-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.getElementById('alert-container').appendChild(alert);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 150);
        }, 5000);
    }

    function calculatePasswordStrength(password) {
        // Very basic password strength calculation
        // In a production environment, consider using a library like zxcvbn

        const result = {
            score: 0,
            suggestions: []
        };

        if (!password) {
            return result;
        }

        // Length check
        if (password.length < 8) {
            result.suggestions.push('Make your password at least 8 characters long');
        } else if (password.length >= 12) {
            result.score += 2;
        } else {
            result.score += 1;
        }

        // Complexity checks
        if (/[A-Z]/.test(password)) {
            result.score += 1;
        } else {
            result.suggestions.push('Add uppercase letters');
        }

        if (/[a-z]/.test(password)) {
            result.score += 1;
        } else {
            result.suggestions.push('Add lowercase letters');
        }

        if (/[0-9]/.test(password)) {
            result.score += 1;
        } else {
            result.suggestions.push('Add numbers');
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            result.score += 1;
        } else {
            result.suggestions.push('Add special characters (!@#$%^&*)');
        }

        // Normalize score to 0-4 range
        result.score = Math.min(4, Math.floor(result.score / 2));

        return result;
    }
});
