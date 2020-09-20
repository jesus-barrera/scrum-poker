/**
 * Serves as container for all Toast notifications, including those added by the
 * notify function.
 */
import React, { useState, useEffect, useMemo } from 'react';
import notify from './notify';
import Toast from './Toast';
import './ToastContainer.css';

const createToastContainer = () => {
  let el = document.getElementById('toast-container');

  if (el) return el;

  el = document.createElement('div');
  el.id = 'toast-container';

  document.body.appendChild(el);

  return el;
}

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // The container must be present in the DOM before any Toast is rendered as
  // they use a "portal" to the container (see Toast.js), so it must be added
  // from here.
  const el = useMemo(createToastContainer, []);

  // Subscribe to notification changes
  useEffect(() => {
    const onNotify = (toasts) => {
      setToasts(toasts);
    };

    notify.subscribe(onNotify);

    return () => notify.unsubscribe(onNotify);
  }, []);

  // Remove container
  useEffect(() => {
    return () => document.removeChild(el);
  }, [el]);

  return toasts.map((item, index) => (
    <Toast type={item.type} key={item.id || index}>{item.text}</Toast>
  ));
}

export default React.memo(ToastContainer);
