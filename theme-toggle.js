const THEME_STORAGE_KEY = "pixel-perfect-theme";
const DARK_THEME = "dark";
const FRUTIGER_AERO_THEME = "frutiger-aero";
const siteLogo = document.querySelector(".site-logo");
const darkModeToggle = document.getElementById("darkModeToggle");
const HOLD_DURATION_MS = 1000;
let holdTimer = 0;
let logoHoldActivated = false;

function applyTheme(theme) {
  if (theme === FRUTIGER_AERO_THEME || theme === DARK_THEME) {
    document.body.dataset.theme = theme;
  } else {
    delete document.body.dataset.theme;
  }

  updateThemeToggle(theme);
}

function getSavedTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
}

function saveTheme(theme) {
  try {
    if (theme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore storage failures and keep the current page state.
  }
}

function updateThemeToggle(theme) {
  if (!darkModeToggle) {
    return;
  }

  const isDark = theme === DARK_THEME;
  darkModeToggle.innerHTML = `<span aria-hidden="true">${isDark ? "☀" : "☾"}</span>`;
  darkModeToggle.setAttribute("aria-pressed", String(isDark));
  darkModeToggle.setAttribute("aria-label", isDark ? "Disable dark mode" : "Enable dark mode");
}

applyTheme(getSavedTheme());

if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === DARK_THEME ? "" : DARK_THEME;
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

if (siteLogo) {
  const toggleTheme = () => {
    const nextTheme = document.body.dataset.theme === FRUTIGER_AERO_THEME ? "" : FRUTIGER_AERO_THEME;
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  };

  const clearHoldTimer = () => {
    if (!holdTimer) {
      return;
    }

    window.clearTimeout(holdTimer);
    holdTimer = 0;
  };

  const startHoldTimer = () => {
    clearHoldTimer();
    siteLogo.classList.remove("is-popping");
    void siteLogo.offsetWidth;
    siteLogo.classList.add("is-popping");

    holdTimer = window.setTimeout(() => {
      holdTimer = 0;
      logoHoldActivated = true;
      toggleTheme();
    }, HOLD_DURATION_MS);
  };

  siteLogo.addEventListener("click", (event) => {
    if (!logoHoldActivated) {
      return;
    }

    event.preventDefault();
    logoHoldActivated = false;
  });

  siteLogo.addEventListener("mousedown", startHoldTimer);
  siteLogo.addEventListener("touchstart", startHoldTimer, { passive: true });
  siteLogo.addEventListener("mouseup", clearHoldTimer);
  siteLogo.addEventListener("mouseleave", clearHoldTimer);
  siteLogo.addEventListener("touchend", clearHoldTimer);
  siteLogo.addEventListener("touchcancel", clearHoldTimer);
}
