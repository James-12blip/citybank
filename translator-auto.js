// translator-auto.js - Auto-injects translator into all pages

(function() {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslator);
    } else {
        initTranslator();
    }

    function initTranslator() {
        // Inject CSS styles
        injectStyles();
        
        // Inject HTML into header
        injectTranslatorHTML();
        
        // Load Google Translate
        loadGoogleTranslate();
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.textContent = `
            .translate-box {
                display: inline-block !important;
                vertical-align: middle;
                margin: 0 8px;
                z-index: 9999;
            }
            .goog-te-gadget {
                font-family: inherit !important;
                font-size: 12px !important;
                color: #333 !important;
            }
            .goog-te-gadget-simple {
                background-color: rgba(255,255,255,0.9) !important;
                border: 1px solid #ddd !important;
                border-radius: 6px !important;
                padding: 6px 10px !important;
                color: #333 !important;
            }
            .goog-te-gadget-simple .goog-te-menu-value {
                color: #333 !important;
            }
            .goog-te-gadget-simple .goog-te-menu-value span {
                color: #333 !important;
            }
            .goog-te-banner-frame {
                display: none !important;
            }
            body {
                top: 0 !important;
            }
            .translate-box.loading::after {
                content: 'EN';
                color: #666;
                font-size: 12px;
                padding: 6px 10px;
                background: rgba(255,255,255,0.9);
                border-radius: 6px;
                border: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }

    function injectTranslatorHTML() {
        // Find the header
        var header = document.querySelector('header') || document.querySelector('.header') || document.querySelector('.landing-header');
        
        if (header) {
            // Check if translator already exists
            if (!document.getElementById('google_translate_element')) {
                var translatorDiv = document.createElement('div');
                translatorDiv.id = 'google_translate_element';
                translatorDiv.className = 'translate-box loading';
                
                // Try to insert after h1 or logo
                var h1 = header.querySelector('h1');
                var logo = header.querySelector('.logo');
                
                if (h1 && h1.nextSibling) {
                    h1.parentNode.insertBefore(translatorDiv, h1.nextSibling);
                } else if (logo && logo.nextSibling) {
                    logo.parentNode.insertBefore(translatorDiv, logo.nextSibling);
                } else {
                    // Append to header
                    header.appendChild(translatorDiv);
                }
            }
        }
    }

    function loadGoogleTranslate() {
        // Define the init function globally
        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,zh-TW,ja,ko,ar,hi,vi,th,pl,tr,nl,sv,da,no,fi,cs,el,he,id,ms,tl,uk,ro,hu',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');

            // Remove loading class
            var element = document.getElementById('google_translate_element');
            if (element) {
                element.classList.remove('loading');
            }

            // Apply saved language
            setTimeout(function() {
                applySavedLanguage();
            }, 1000);
        };

        // Load Google Translate script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    }

    // Save and apply language functions
    function saveLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
    }

    function getSavedLanguage() {
        return localStorage.getItem('selectedLanguage');
    }

    function applySavedLanguage() {
        var savedLang = getSavedLanguage();
        if (savedLang && savedLang !== 'en') {
            var selectBox = document.querySelector('.goog-te-combo');
            if (selectBox) {
                selectBox.value = savedLang;
                selectBox.dispatchEvent(new Event('change'));
            }
        }
    }

    // Monitor language changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('goog-te-combo')) {
            saveLanguage(e.target.value);
        }
    });
})();
