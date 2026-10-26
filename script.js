(function () {
  const slider = document.getElementById('slider');
  const clip = document.getElementById('clip');
  const handle = document.getElementById('handle');
  const frontImg = clip.querySelector('.image-front');

  let dragging = false;

  function syncFrontImageWidth() {
    frontImg.style.width = slider.getBoundingClientRect().width + 'px';
  }

  function setPosition(percent) {
    percent = Math.min(100, Math.max(0, percent));
    clip.style.width = percent + '%';
    handle.style.left = percent + '%';
    slider.setAttribute('aria-valuenow', Math.round(percent));
  }

  function percentFromClientX(clientX) {
    const rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  function onPointerDown(e) {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    setPosition(percentFromClientX(e.clientX));
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setPosition(percentFromClientX(e.clientX));
  }

  function onPointerUp(e) {
    dragging = false;
    if (slider.hasPointerCapture && slider.hasPointerCapture(e.pointerId)) {
      slider.releasePointerCapture(e.pointerId);
    }
  }

  slider.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointermove', onPointerMove);
  slider.addEventListener('pointerup', onPointerUp);
  slider.addEventListener('pointercancel', onPointerUp);

  // Keyboard accessibility
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-label', 'Comparison slider: ideal versus reality');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '100');

  slider.addEventListener('keydown', function (e) {
    const current = parseFloat(clip.style.width) || 50;
    if (e.key === 'ArrowLeft') setPosition(current - 5);
    if (e.key === 'ArrowRight') setPosition(current + 5);
  });

  window.addEventListener('resize', syncFrontImageWidth);

  // init
  syncFrontImageWidth();
  setPosition(50);

  // Re-sync once images are fully loaded (sizes can shift)
  window.addEventListener('load', syncFrontImageWidth);
})();
