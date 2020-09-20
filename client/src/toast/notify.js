/**
 * Manages Toast notifications.
 */
const TOAST_TIMEOUT = 3000;
var count = 0;
var toasts = [];
var onChange = (data) => {};

function dimiss(id) {
  const i = toasts.findIndex((item) => item.id === id);

  if (i < 0) return;

  toasts.splice(i, 1);
  toasts = [...toasts];

  onChange(toasts);
}

function subscribe(callback) {
  onChange = callback;
}

function unsubscribe() {
  onChange = (data) => {};
}

export default function notify(item) {
  item.id = ++count;
  toasts = toasts.concat(item);

  if (item.timeout !== false) {
    setTimeout(() => dimiss(item.id), item.timeout || TOAST_TIMEOUT);
  }

  onChange(toasts);

  return item.id;
}

notify.dimiss = dimiss;
notify.subscribe = subscribe;
notify.unsubscribe = unsubscribe;
