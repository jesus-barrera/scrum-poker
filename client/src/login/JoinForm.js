import React, { useState, useCallback } from 'react';

function JoinForm({ onSubmit }) {
  const [values, setValues] = useState({ sessionId: '', username: '' });

  const handleInput = useCallback(({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value
    });
  }, [values]);

  const handleBlur = useCallback(({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value.trim()
    });
  }, [values]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (! values.sessionId || ! values.username) {
      alert("Datos incorrectos!");
      return;
    }

    onSubmit(values);
  }, [values, onSubmit]);

  return (
    <>
      <h2>Unirse a una sesión</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Tu nombre: </label>
          <input
            name="username"
            onChange={handleInput}
            onBlur={handleBlur}
            value={values.username}
          />
        </fieldset>

        <fieldset>
          <label>ID de sesión: </label>
          <input
            name="sessionId"
            autoComplete="off"
            onChange={handleInput}
            onBlur={handleBlur}
            value={values.sessionId}
          />
        </fieldset>

        <button>ENTRAR</button>
      </form>
    </>
  );
}

export default React.memo(JoinForm);
