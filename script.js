const draggables = document.querySelectorAll('.draggable');
const court = document.getElementById('court-container');
const resetBtn = document.getElementById('reset-btn');

// Store initial positions for reset
const initialPositions = {};
draggables.forEach((el) => {
  initialPositions[el.id] = {
    top: el.style.top,
    left: el.style.left,
  };
});

let draggedItem = null;

// ==============================
// Desktop (mouse / trackpad)
// ==============================
draggables.forEach((el) => {
  el.addEventListener('dragstart', dragStart);
});

court.addEventListener('dragover', dragOver);
court.addEventListener('drop', drop);

function dragStart(e) {
  // Ignore touch-based drag events (were disabled later), keep only mouse
  if (e.pointerType === 'touch') return;
  draggedItem = e.target;
  draggedItem.style.opacity = '0.5';
  e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);

  const courtRect = court.getBoundingClientRect();
  let left = e.clientX - courtRect.left - element.offsetWidth / 2;
  let top = e.clientY - courtRect.top - element.offsetHeight / 2;

  // Boundaries check
  left = Math.max(0, Math.min(left, court.offsetWidth - element.offsetWidth));
  top = Math.max(0, Math.min(top, court.offsetHeight - element.offsetHeight));

  element.style.left = left + 'px';
  element.style.top = top + 'px';
  element.style.position = 'absolute';

  draggedItem.style.opacity = '1';
  draggedItem = null;
}

resetBtn.addEventListener('click', () => {
  draggables.forEach((el) => {
    const pos = initialPositions[el.id];
    el.style.top = pos.top;
    el.style.left = pos.left;
  });
});

/* =====================================================
   TOUCH INPUT HANDLING  –  tap‑to‑select → tap‑to‑place
   =====================================================
   1) First tap on a .draggable element selects it (adds outline)
   2) Second tap anywhere on #court-container re‑positions the element
   Desktop behaviour remains unchanged.
*/
(function () {
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) return; // Abort if not touch capable

  // Disable native HTML5 drag on touch so it doesn't conflict
  draggables.forEach((el) => el.setAttribute('draggable', 'false'));

  const SELECTED_CLASS = 'selected-for-move';
  // Inject once — keeps styles inside JS for portability
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .${SELECTED_CLASS} {
      outline: 3px dashed #ff6a00;
      outline-offset: -3px;
      transition: outline 0.1s ease-in-out;
    }`;
  document.head.appendChild(styleTag);

  let selectedItem = null;

  // ───── Select Phase ─────
  draggables.forEach((el) => {
    el.addEventListener(
      'touchstart',
      (e) => {
        // Prevent scroll AND stop bubbling so court doesn't capture same tap
        e.preventDefault();
        e.stopPropagation();

        // Re‑selecting the same element toggles selection off
        if (selectedItem === el) {
          el.classList.remove(SELECTED_CLASS);
          selectedItem = null;
          return;
        }
        // Clear previous selection, if any
        if (selectedItem) {
          selectedItem.classList.remove(SELECTED_CLASS);
        }
        // Mark new selection
        selectedItem = el;
        selectedItem.classList.add(SELECTED_CLASS);
      },
      { passive: false }
    );
  });

  // ───── Place Phase ─────
  court.addEventListener(
    'touchstart',
    (e) => {
      if (!selectedItem) return; // nothing selected → nothing to place

      const touch = e.touches[0];
      const courtRect = court.getBoundingClientRect();

      let left =
        touch.clientX - courtRect.left - selectedItem.offsetWidth / 2;
      let top =
        touch.clientY - courtRect.top - selectedItem.offsetHeight / 2;

      // Constrain inside court bounds
      left = Math.max(
        0,
        Math.min(left, court.offsetWidth - selectedItem.offsetWidth)
      );
      top = Math.max(
        0,
        Math.min(top, court.offsetHeight - selectedItem.offsetHeight)
      );

      selectedItem.style.left = `${left}px`;
      selectedItem.style.top = `${top}px`;
      selectedItem.style.position = 'absolute';

      // Clean up
      selectedItem.classList.remove(SELECTED_CLASS);
      selectedItem = null;
    },
    { passive: true }
  );
})();
