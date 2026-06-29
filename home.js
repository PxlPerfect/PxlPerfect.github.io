const animatedPhrase = document.getElementById("homeAnimatedPhrase");

if (animatedPhrase) {
  const phrases = (animatedPhrase.dataset.phrases || "")
    .split(",")
    .map((phrase) => phrase.trim())
    .filter(Boolean);

  if (phrases.length > 0) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPING_DELAY = 85;
    const DELETING_DELAY = 42;
    const HOLD_DELAY = 1350;
    const NEXT_DELAY = 240;

    const tick = () => {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        charIndex += 1;
        animatedPhrase.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex >= currentPhrase.length) {
          isDeleting = true;
          animatedPhrase.classList.add("is-deleting");
          window.setTimeout(tick, HOLD_DELAY);
          return;
        }

        window.setTimeout(tick, TYPING_DELAY);
        return;
      }

      charIndex -= 1;
      animatedPhrase.textContent = currentPhrase.slice(0, Math.max(0, charIndex));

      if (charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        animatedPhrase.classList.remove("is-deleting");
        window.setTimeout(tick, NEXT_DELAY);
        return;
      }

      window.setTimeout(tick, DELETING_DELAY);
    };

    tick();
  }
}
