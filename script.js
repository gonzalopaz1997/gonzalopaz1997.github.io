const draggables = document.querySelectorAll('.draggable');
const court = document.getElementById('court-container');
const resetBtn = document.getElementById('reset-btn');

// Store initial positions for reset
const initialPositions = {};
draggables.forEach(el => {
  initialPositions[el.id] = {
    top: el.style.top,
    left: el.style.left,
  };
});

let draggedItem = null;

draggables.forEach(el => {
  el.addEventListener('dragstart', dragStart);
});

court.addEventListener('dragover', dragOver);

function dragStart(e) {
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
  draggables.forEach(el => {
    const pos = initialPositions[el.id];
    el.style.top = pos.top;
    el.style.left = pos.left;
  });
});

/* =========================
   TOUCH INPUT HANDLING
   =========================
   On touch‑capable devices we switch the interaction model from drag‑and‑drop
   to “tap‑to‑select” + “tap‑to‑place”.
   1) First tap on a .draggable element selects it.
   2) Second tap anywhere in #court-container places the element centred at
      the tap location (respecting court boundaries).
   Desktop behaviour (pointerType === 'mouse') remains unchanged.
*/
(function () {
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) return; // Desktop keeps the original drag behaviour

  // Give visual feedback when an element is selected
  const SELECTED_CLASS = 'selected-for-move';
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .${SELECTED_CLASS} {
      outline: 2px dashed #ff6600;
      outline-offset: -2px;
    }`;
  document.head.appendChild(styleTag);

  let selectedItem = null;

  draggables.forEach((el) => {
    // Disable native HTML5 dragging on touch so it does not interfere
    el.setAttribute('draggable', 'false');

    el.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault(); // prevent accidental page scroll
        // If we tapped the already‑selected element, deselect it
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

  court.addEventListener(
    'touchstart',
    (e) => {
      if (!selectedItem) return; // nothing selected → nothing to place

      // The first touch point gives us the tap coordinates
      const touch = e.touches[0];
      const courtRect = court.getBoundingClientRect();

      let left =
        touch.clientX - courtRect.left - selectedItem.offsetWidth / 2;
      let top =
        touch.clientY - courtRect.top - selectedItem.offsetHeight / 2;

      // Keep the element inside the court boundaries
      left = Math.max(
        0,
        Math.min(left, court.offsetWidth - selectedItem.offsetWidth)
      );
      top = Math.max(
        0,
        Math.min(top, court.offsetHeight - selectedItem.offsetHeight)
      );

      selectedItem.style.left = left + 'px';
      selectedItem.style.top = top + 'px';
      selectedItem.style.position = 'absolute';

      // Clear selection and feedback
      selectedItem.classList.remove(SELECTED_CLASS);
      selectedItem = null;
    },
    { passive: true }
  );
})();
