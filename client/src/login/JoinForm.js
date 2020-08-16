import React from 'react';
import useForm from './useForm';

function JoinForm({ onSubmit }) {
  const { handleBlur, handleChange, handleSubmit, values, errors } = useForm({
    defaultValues: { roomId: '', username: '' },
    validate: (values) => {
      const errors = {};

      if (!values.roomId) {
        errors.roomId = 'Debes ingresar el ID de sesión.';
      }

      if (!values.username) {
        errors.username = 'Debes ingresar un nombre.';
      }

      return errors;
    },
    onSubmit,
  });

  return (
    <>
      <h2>Unirse a una sesión</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Tu nombre: </label>
          <input
            name="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
          {errors.username && <small>{errors.username}</small>}
        </fieldset>

        <fieldset>
          <label>ID de sesión: </label>
          <input
            name="roomId"
            autoComplete="off"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.roomId}
          />
          {errors.roomId && <small>{errors.roomId}</small>}
        </fieldset>

        <button>ENTRAR</button>
      </form>
    </>
  );
}

export default React.memo(JoinForm);
