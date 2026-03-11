// translator.js - Cross-page translation using cookies

function googleTranslateElementInit() {
  // Check for saved language in cookie
  var savedLang = getCookie('googtrans');
  
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
  if (savedLang) {
    setTimeout(function() {
      var lang = savedLang.split('/')[2]; // Format: /en/es
      if (lang) {
        var selectBox = document.querySelector('.goog-te-combo');
        if (selectBox) {
          selectBox.value = lang;
          selectBox.dispatchEvent(new Event('change'));
        }
      }
    }, 800);
  }
}

// Cookie helpers
function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/; domain=' + window.location.hostname;
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Monitor language changes and save to cookie
function monitorLanguageChange() {
  // Watch for the translate dropdown
  var selectBox = document.querySelector('.goog-te-combo');
  if (selectBox) {
    selectBox.addEventListener('change', function() {
      var lang = this.value;
      if (lang && lang !== 'en') {
        setCookie('googtrans', '/en/' + lang, 30); // 30 days
        setCookie('googtrans', '/en/' + lang, 30, '.' + window.location.hostname);
      } else {
        setCookie('googtrans', '', -1); // Delete cookie
      }
    });
  }
}

// Run monitor after page loads
setTimeout(monitorLanguageChange, 1500);

// Load Google Translate
(function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(script, s);
})();
