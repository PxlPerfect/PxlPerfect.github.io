(() => {
  const config = window.PIXEL_PERFECT_ADS || {};
  const publisherId = String(config.publisherId || "").trim();
  const hasValidPublisherId = /^ca-pub-\d{16}$/.test(publisherId);
  const isLocalPreview =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
    new URLSearchParams(window.location.search).has("previewAds");
  const showPlaceholders = Boolean(config.previewPlaceholders || isLocalPreview);
  const adShells = Array.from(document.querySelectorAll("[data-ad-shell]"));

  function showPreview(shell) {
    const slotKey = shell.dataset.adSlotKey || "ad";
    const preview = document.createElement("div");
    preview.className = "ad-placeholder";
    preview.innerHTML = `<strong>Ad placement preview</strong><span>${slotKey}</span>`;
    shell.append(preview);
    shell.hidden = false;
    shell.classList.add("is-preview");
  }

  function enablePrivacyChoiceLinks() {
    document.querySelectorAll("[data-open-privacy-choices]").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () => {
        window.googlefc = window.googlefc || {};
        window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];

        if (typeof window.googlefc.showRevocationMessage === "function") {
          window.googlefc.callbackQueue.push(window.googlefc.showRevocationMessage);
        }
      });
    });
  }

  if (!hasValidPublisherId) {
    if (showPlaceholders) {
      adShells.forEach(showPreview);
    }
    return;
  }

  const accountMeta = document.createElement("meta");
  accountMeta.name = "google-adsense-account";
  accountMeta.content = publisherId;
  document.head.append(accountMeta);

  const loader = document.createElement("script");
  loader.async = true;
  loader.crossOrigin = "anonymous";
  loader.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    publisherId
  )}`;
  document.head.append(loader);

  adShells.forEach((shell) => {
    const slotKey = shell.dataset.adSlotKey;
    const slotId = String(config.slots?.[slotKey] || "").trim();

    if (!/^\d+$/.test(slotId)) {
      if (showPlaceholders) {
        showPreview(shell);
      }
      return;
    }

    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.dataset.adClient = publisherId;
    ad.dataset.adSlot = slotId;
    ad.dataset.adFormat = "auto";
    ad.dataset.fullWidthResponsive = "true";
    shell.append(ad);
    shell.hidden = false;
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });

  enablePrivacyChoiceLinks();
})();
