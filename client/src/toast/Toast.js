/**
 * Toast component, appends itself to the ToastContainer.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './Toast.css';

function Toast({ type, children }) {
  const container = document.getElementById('toast-container');

  // We use a portal to the container to render the Toast, this allows us to insert
  // a Toast in any part of the React tree an it will be appended to the container.
  // This is usefull for static toasts that are rendered based in a component state.
  return container && ReactDOM.createPortal(
    <div className={"toast " + type}>
      <div className="toast__content">
          {children}
      </div>
    </div>,
    container);
}

export default React.memo(Toast);
