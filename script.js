// script.js
const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // Reactive data for the referral form (removed — replaced by Projects section)

        // Projects data (for Projects section)
        const projects = ref([
            {
                name: 'Example Site',
                url: 'https://cmndegwa.github.io/P-TWS/',
                screenshot: './assets/images/TWS.png',
                public: true,
                desc: 'Live demo — click image to open.'
            }
        ]);

        const currentYear = computed(() => new Date().getFullYear());

        // Modal state for quote request
        const selectedService = ref('');
        const quoteName = ref('');
        const quoteEmail = ref('');
        const quoteDetails = ref('');
        const quoteSuccess = ref('');
        const quoteError = ref('');

        // Referral logic removed; projects are displayed in the Projects section

        // --- Core App Methods ---
        const requestQuote = (serviceName) => {
            selectedService.value = serviceName;
            quoteName.value = '';
            quoteEmail.value = '';
            quoteDetails.value = '';
            quoteSuccess.value = '';
            quoteError.value = '';
            const modal = new bootstrap.Modal(document.getElementById('quoteModal'));
            modal.show();
        };

        const submitQuoteRequest = async () => {
            if (quoteName.value && quoteEmail.value && quoteDetails.value) {
                try {
                    const form = document.getElementById('quoteForm');
                    const formData = new FormData(form);
                    const response = await fetch('https://formspree.io/f/movwwqne', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: formData
                    });
                    if (response.ok) {
                        quoteSuccess.value = 'Your quote request has been sent!';
                        quoteError.value = '';
                        // Optionally reset form fields
                        quoteName.value = '';
                        quoteEmail.value = '';
                        quoteDetails.value = '';
                    } else {
                        quoteError.value = 'Failed to send request. Please try again.';
                        quoteSuccess.value = '';
                    }
                } catch (e) {
                    quoteError.value = 'Failed to send request. Please try again.';
                    quoteSuccess.value = '';
                }
            } else {
                quoteError.value = 'Please fill in all fields.';
                quoteSuccess.value = '';
            }
        };

        const openSocial = (platform) => {
            const urls = {
                whatsapp: 'https://wa.me/254712629497?text=Hello%20I%20would%20like%20to%20request%20a%20quote',
                linkedin: 'https://www.linkedin.com/in/clinton-m-n/',
                twitter: 'https://twitter.com/M_Ndegwa'
            };
            const url = urls[platform];
            if (url) {
                window.open(url, '_blank');
            }
        };

        // --- Social & Download Button Persistence Logic ---
        const showSocialBtn = ref('');
        const showDownloadBtn = ref('');

        function onSocialEnter(platform) {
            showSocialBtn.value = platform;
        }
        function onSocialLeave(platform) {
            setTimeout(() => {
                if (!document.activeElement.classList.contains('social-btn') || document.activeElement.dataset.platform !== platform) {
                    showSocialBtn.value = '';
                }
            }, 100);
        }
        function onSocialBtnEnter(platform) {
            showSocialBtn.value = platform;
        }
        function onSocialBtnLeave(platform) {
            setTimeout(() => {
                if (!document.activeElement.classList.contains('social-btn') || document.activeElement.dataset.platform !== platform) {
                    showSocialBtn.value = '';
                }
            }, 100);
        }

        function onDownloadEnter(doc) {
            showDownloadBtn.value = doc;
        }
        function onDownloadLeave(doc) {
            setTimeout(() => {
                if (!document.activeElement.classList.contains('download-btn') || document.activeElement.dataset.doc !== doc) {
                    showDownloadBtn.value = '';
                }
            }, 100);
        }
        function onDownloadBtnEnter(doc) {
            showDownloadBtn.value = doc;
        }
        function onDownloadBtnLeave(doc) {
            setTimeout(() => {
                if (!document.activeElement.classList.contains('download-btn') || document.activeElement.dataset.doc !== doc) {
                    showDownloadBtn.value = '';
                }
            }, 100);
        }

        // --- Download Button Persistence Logic ---
        const visibleDownloadBtn = ref('');
        let downloadBtnTimeout = null;

        function showDownloadButton(doc) {
            clearTimeout(downloadBtnTimeout);
            visibleDownloadBtn.value = doc;
        }
        function hideDownloadButton() {
            downloadBtnTimeout = setTimeout(() => {
                visibleDownloadBtn.value = '';
            }, 7000); // 7 seconds
        }
        function keepDownloadButton(doc) {
            clearTimeout(downloadBtnTimeout);
            visibleDownloadBtn.value = doc;
        }
        function leaveDownloadButton(doc) {
            downloadBtnTimeout = setTimeout(() => {
                visibleDownloadBtn.value = '';
            }, 7000);
        }

        // --- Contact Button Persistence Logic ---
        const visibleContactBtn = ref('');
        let contactBtnTimeout = null;

        function showContactButton(platform) {
            clearTimeout(contactBtnTimeout);
            visibleContactBtn.value = platform;
        }
        function hideContactButton() {
            contactBtnTimeout = setTimeout(() => {
                visibleContactBtn.value = '';
            }, 7000); // 7 seconds
        }
        function keepContactButton(platform) {
            clearTimeout(contactBtnTimeout);
            visibleContactBtn.value = platform;
        }
        function leaveContactButton() {
            contactBtnTimeout = setTimeout(() => {
                visibleContactBtn.value = '';
            }, 7000);
        }

        // --- Download Email Modal State and Methods ---
        const selectedDownloadCategory = ref('');
        const selectedDownloadDoc = ref('');
        const downloadEmail = ref('');
        const downloadSuccess = ref('');
        const downloadError = ref('');

        function openDownloadModal(category, doc) {
            selectedDownloadCategory.value = category;
            selectedDownloadDoc.value = doc;
            downloadEmail.value = '';
            downloadSuccess.value = '';
            downloadError.value = '';
            const modal = new bootstrap.Modal(document.getElementById('downloadEmailModal'));
            modal.show();
        }

        const submitDownloadRequest = async () => {
            if (downloadEmail.value && selectedDownloadCategory.value && selectedDownloadDoc.value) {
                try {
                    const form = document.getElementById('downloadForm');
                    const formData = new FormData(form);
                    formData.append('downloaded_at', new Date().toISOString());

                    const response = await fetch('https://formspree.io/f/movwwqne', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: formData
                    });

                    if (response.ok) {
                        // Trigger the download from the correct subfolder
                        const docPath = `/assets/docs/${selectedDownloadCategory.value}/${selectedDownloadDoc.value}`;
                        const link = document.createElement('a');
                        link.href = docPath;
                        link.download = selectedDownloadDoc.value;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        downloadSuccess.value = 'Document sent!';
                        downloadError.value = '';
                    } else {
                        downloadError.value = 'Failed to send request. Please try again.';
                        downloadSuccess.value = '';
                    }
                } catch {
                    downloadError.value = 'Failed to send request. Please try again.';
                    downloadSuccess.value = '';
                }
            } else {
                downloadError.value = 'Please enter your email.';
                downloadSuccess.value = '';
            }
        };

        return {
            currentYear,
            // Projects data
            projects,
            // Modal state and methods
            selectedService,
            quoteName,
            quoteEmail,
            quoteDetails,
            quoteSuccess,
            quoteError,
            requestQuote,
            submitQuoteRequest,
            openSocial,
            // Social & Download Button Persistence
            showSocialBtn, showDownloadBtn,
            onSocialEnter, onSocialLeave, onSocialBtnEnter, onSocialBtnLeave,
            onDownloadEnter, onDownloadLeave, onDownloadBtnEnter, onDownloadBtnLeave,
            visibleDownloadBtn,
            showDownloadButton,
            hideDownloadButton,
            keepDownloadButton,
            leaveDownloadButton,
            // Contact Button Persistence
            visibleContactBtn,
            showContactButton,
            hideContactButton,
            keepContactButton,
            leaveContactButton,
            // Download Email Modal
            selectedDownloadCategory,
            selectedDownloadDoc,
            downloadEmail,
            downloadSuccess,
            downloadError,
            openDownloadModal,
            submitDownloadRequest
        };
    }
}).mount('#app');

// --- ScrollSpy Implementation ---
window.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = ['home', 'services', 'contact', 'projects'].map(id => document.getElementById(id));

    function onScrollSpy() {
        let currentSection = null;
        const scrollPos = window.scrollY + window.innerHeight / 3;

        for (const section of sections) {
            if (section && section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentSection && href.replace('#', '') === currentSection.id) {
                link.parentElement.classList.add('active-scrollspy');
            } else {
                link.parentElement.classList.remove('active-scrollspy');
            }
        });
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.getElementById(href.substring(1));
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Universal Fade-in on Scroll Implementation ---
    function revealOnScroll() {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // When scrolling down: fade in and move up as element enters from below
            if (rect.top < windowHeight * 0.90 && rect.bottom > 0) {
                el.classList.add('visible');
                el.classList.remove('hidden-up');
            }
            // When scrolling up: fade out and move down as element leaves upwards
            else if (rect.bottom <= 0) {
                el.classList.remove('visible');
                el.classList.add('hidden-up');
            }
            // When element is below the viewport: reset to initial state
            else {
                el.classList.remove('visible', 'hidden-up');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Initial check on load

    window.addEventListener('scroll', function() {
    const btn = document.getElementById('backToTop');
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const percent = Math.min(scrolled / docHeight, 1);

    // Show/hide button as before
    btn.style.display = scrolled > 100 ? 'block' : 'none';

    // Animate background height
    btn.style.setProperty('--backtotop-bg-height', `${percent * 100}%`);
    btn.querySelector('span')?.style.setProperty('color', percent > 0.5 ? '#fff' : 'var(--extra-color)');
    });

    // Set the background height via CSS variable
    document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('backToTop');
    btn.style.setProperty('--backtotop-bg-height', '0%');
    });

    // Add smooth scroll to top functionality
    const btn = document.getElementById('backToTop');
    if (btn) {
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});


