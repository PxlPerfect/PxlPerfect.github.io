window.PIXEL_PERFECT_ADS = Object.freeze({
  // Paste the AdSense client ID exactly as Google provides it.
  // Example format: ca-pub-1234567890123456
  publisherId: "",

  // Create responsive Display ad units in AdSense, then paste each numeric slot ID.
  slots: Object.freeze({
    homeBanner: "",
    toolBanner: "",
    toolFooter: "",
  }),

  // Placeholders are automatically visible on localhost and file:// previews.
  previewPlaceholders: false,
});
