/* ============================================
   Bebe Food — Theme Switcher
   Floating UI + localStorage persistence
   ============================================ */

(function() {
  'use strict';

  const THEMES = [
    { id: 'classic',  name: 'Sage & Clay',        emoji: '🌿', colors: ['#C4704B', '#8BA888', '#E8DFD3', '#C98B8B', '#FAFAF7'] },
    { id: 'coral',    name: 'Olive Garden',        emoji: '🫒', colors: ['#7D8F69', '#D4956A', '#DFE4D7', '#CD7B6F', '#F5F4EF'] },
    { id: 'berry',    name: 'Blush Terracotta',    emoji: '🌸', colors: ['#D4766E', '#8B9F82', '#F2D9D0', '#E8A598', '#FBF5F3'] },
    { id: 'ocean',    name: 'Forest Honey',        emoji: '🌲', colors: ['#4A6741', '#C9873D', '#D8E0CF', '#C97B5E', '#F3F5F0'] },
    { id: 'tropical', name: 'Plum Amber',          emoji: '🍇', colors: ['#7C5E8A', '#C4854B', '#E4D8EC', '#C98B70', '#F8F5FA'] },
  ];

  const STORAGE_KEY = 'bf-theme';

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'classic';
  }

  function setTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
    updateSwitcherUI(themeId);
  }

  function updateSwitcherUI(activeId) {
    document.querySelectorAll('.ts-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.theme === activeId);
    });
    const label = document.querySelector('.ts-label');
    if (label) {
      const theme = THEMES.find(t => t.id === activeId);
      label.textContent = theme ? `${theme.emoji} ${theme.name}` : '';
    }
  }

  function createSwitcher() {
    const bar = document.createElement('div');
    bar.className = 'theme-switcher';
    bar.innerHTML = `
      <div class="ts-inner">
        <span class="ts-title">Culori</span>
        <div class="ts-swatches">
          ${THEMES.map(t => `
            <button class="ts-swatch" data-theme="${t.id}" title="${t.name}"
              style="--sw-c1:${t.colors[0]};--sw-c2:${t.colors[1]};--sw-c3:${t.colors[2]};--sw-c4:${t.colors[3]};--sw-bg:${t.colors[4]}">
              <span class="ts-swatch-inner"></span>
            </button>
          `).join('')}
        </div>
        <span class="ts-label"></span>
      </div>
    `;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .theme-switcher {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99999;
        background: var(--header-bg, #2C2417);
        border-top: 2px solid var(--primary, #C4704B);
        padding: 0;
        font-family: 'Plus Jakarta Sans', sans-serif;
        animation: tsSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
      }
      @keyframes tsSlideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .ts-inner {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 24px;
      }
      .ts-title {
        color: var(--header-text, #FAFAF7);
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        opacity: 0.6;
        white-space: nowrap;
      }
      .ts-swatches {
        display: flex;
        gap: 10px;
        flex: 1;
        justify-content: center;
      }
      .ts-swatch {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 3px solid transparent;
        background: var(--sw-bg);
        cursor: pointer;
        position: relative;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        padding: 0;
        overflow: hidden;
      }
      .ts-swatch:hover {
        transform: scale(1.15);
        border-color: rgba(255,255,255,0.5);
      }
      .ts-swatch.active {
        transform: scale(1.2);
        border-color: white;
        box-shadow: 0 0 0 3px var(--sw-c1), 0 4px 16px rgba(0,0,0,0.3);
      }
      .ts-swatch-inner {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(
          var(--sw-c1) 0deg 90deg,
          var(--sw-c2) 90deg 180deg,
          var(--sw-c3) 180deg 270deg,
          var(--sw-c4) 270deg 360deg
        );
      }
      .ts-label {
        color: var(--header-text, #FAFAF7);
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;
        min-width: 140px;
        text-align: right;
      }
      @media (max-width: 600px) {
        .ts-inner { gap: 8px; padding: 10px 16px; }
        .ts-title { display: none; }
        .ts-label { display: none; }
        .ts-swatch { width: 38px; height: 38px; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(bar);

    // Bind events
    bar.querySelectorAll('.ts-swatch').forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
  }

  // Initialize
  function init() {
    const stored = getStoredTheme();
    document.documentElement.setAttribute('data-theme', stored);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createSwitcher();
        updateSwitcherUI(stored);
      });
    } else {
      createSwitcher();
      updateSwitcherUI(stored);
    }
  }

  // Apply theme immediately (before DOM ready) to avoid flash
  document.documentElement.setAttribute('data-theme', getStoredTheme());
  init();
})();
