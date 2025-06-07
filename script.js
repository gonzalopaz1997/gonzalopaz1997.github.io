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
court.addEventListener('drop', drop);

function dragStart(e) {
  draggedItem = e.target;
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => {// script.js

const draggables = document.querySelectorAll('.draggable');
const court = document.getElementById('court');
const resetBtn = document.getElementById('reset-btn');

// Store initial positions for reset
const initialPositions = {};

draggables.forEach(el => {
initialPositions[el.id] = {
top: el.style.top,
left: el.style.left,
};
});

// Drag & Drop handlers
draggables.forEach(el => {
el.addEventListener('dragstart', dragStart);
});

court.addEventListener('dragover', dragOver);
court.addEventListener('drop', drop);

let draggedItem = null;

function dragStart(e) {
draggedItem = e.target;
e.dataTransfer.setData('text/plain', e.target.id);
setTimeout(() => {
draggedItem.style.opacity = '0.5';
}, 0);
}

function dragOver(e) {
e.preventDefault();
}

function drop(e) {
e.preventDefault();
const id = e.dataTransfer.getData('text/plain');
const element = document.getElementById(id);

// Calculate drop position relative to court container
const courtRect = court.getBoundingClientRect();
let left = e.clientX - courtRect.left - element.offsetWidth / 2;
let top = e.clientY - courtRect.top - element.offsetHeight / 2;

// Keep inside court boundaries
left = Math.max(0, Math.min(left, court.offsetWidth - element.offsetWidth));
top = Math.max(0, Math.min(top, court.offsetHeight - element.offsetHeight));

element.style.left = `${left}px`;
element.style.top = `${top}px`;
element.style.position = 'absolute';

draggedItem.style.opacity = '1';
draggedItem = null;
}

// Reset button
resetBtn.addEventListener('click', () => {
draggables.forEach(el => {
const pos = initialPositions[el.id];
el.style.top = pos.top;
el.style.left = pos.left;
});
});

    draggedItem.style.opacity = '0.5';
  }, 0);
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