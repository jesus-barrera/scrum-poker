import React, { useCallback, useState } from 'react';

function CreateForm({ onSubmit }) {
  const [values, setValues] = useState({ sessionName: '' });

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
    if (! values.sessionName) {
      alert("Datos incorrectos!");
      return;
    }

    onSubmit(values);
  }, [values, onSubmit]);

  return (
    <>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Nombre de sesión: </label>

          <input
            onChange={handleInput}
            onBlur={handleBlur}
            value={values.sessionName}
            name="sessionName"
          />
        </fieldset>
        <button>CREAR</button>
      </form>
    </>
  );
}

export default CreateForm;
