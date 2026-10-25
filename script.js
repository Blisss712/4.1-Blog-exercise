/**
 * CS372 IAS Editorial JavaScript
 * Controls: Progress Bar, Theme Toggle, Font Sizing, TOC Spy, Interactive Widgets, Citation Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initThemeToggle();
  initFontSizeControls();
  initTableOfContentsSpy();
  initInteractiveWidgets();
  initCitationCopy();
  initShareLink();
});

/* 1. Reading Progress Bar */
function initReadingProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* 2. Dark / Light Theme Toggle */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  if (!themeToggleBtn) return;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('site-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // Default to dark cyber aesthetic

  setTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('site-theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        // Moon icon for switching back to dark
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        // Sun icon for switching to light
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }
  }
}

/* 3. Font Size Controls */
function initFontSizeControls() {
  const fontButtons = document.querySelectorAll('.font-btn');
  const savedFontSize = localStorage.getItem('site-font-size') || 'normal';

  document.body.setAttribute('data-font-size', savedFontSize);
  updateActiveFontButton(savedFontSize);

  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      if (size) {
        document.body.setAttribute('data-font-size', size);
        localStorage.setItem('site-font-size', size);
        updateActiveFontButton(size);
      }
    });
  });

  function updateActiveFontButton(size) {
    fontButtons.forEach(btn => {
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* 4. Table of Contents Active Link Spy */
function initTableOfContentsSpy() {
  const headings = document.querySelectorAll('.article-content h2[id], .article-content h3[id]');
  const tocLinks = document.querySelectorAll('.toc-link');

  if (!headings.length || !tocLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach(heading => observer.observe(heading));
}

/* 5. Interactive Tabs & Simulation Widgets */
function initInteractiveWidgets() {
  const widgetContainers = document.querySelectorAll('.interactive-widget');

  widgetContainers.forEach(container => {
    const tabs = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');

        // Reset tabs in this container
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activate selected
        tab.classList.add('active');
        const activeContent = container.querySelector(`#${targetId}`);
        if (activeContent) {
          activeContent.classList.add('active');
        }
      });
    });
  });
}

/* 6. Copy Citation to Clipboard */
function initCitationCopy() {
  const citeButtons = document.querySelectorAll('.btn-cite');

  citeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const citationText = btn.getAttribute('data-citation');
      if (!citationText) return;

      navigator.clipboard.writeText(citationText).then(() => {
        showToast('APA 7th citation copied to clipboard!');
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
        showToast('Failed to copy. Please select manually.');
      });
    });
  });
}

/* 7. Share / Copy Post Link */
function initShareLink() {
  const shareBtn = document.getElementById('share-btn');
  if (!shareBtn) return;

  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Article URL copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy URL.');
    });
  });
}

/* Global Toast Helper */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-cyan)">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
