import React from 'react';
import useForm from './useForm';

function CreateForm({ onSubmit }) {
  const { handleBlur, handleChange, handleSubmit, values, errors } = useForm({
    defaultValues: { roomName: '' },
    onSubmit,
  });

  return (
    <>
      <h2>Crear una sesión</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Nombre de sesión (opcional): </label>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.roomName}
            name="roomName"
          />
          {errors.roomName && <small>{errors.roomName}</small>}
        </fieldset>

        <button>CREAR</button>
      </form>
    </>
  );
}

export default CreateForm;
