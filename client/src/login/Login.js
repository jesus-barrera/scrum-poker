import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';
import { joinRoom, createRoom } from '../redux/ducks/room';
import isMobile from '../common/helpers/isMobile';
import './Login.css';

export const Forms = {
  JOIN: 'JOIN',
  CREATE: 'CREATE',
};

function Login({  socket }) {
  const dispatch = useDispatch();

  // Set default form. If the device is mobile, we show the join form first.
  const [form, setForm] = useState(isMobile()
    ? Forms.JOIN
    : Forms.CREATE);

  const switchForm = useCallback((e) => {
    e.preventDefault();

    setForm(form === Forms.CREATE
      ? Forms.JOIN
      : Forms.CREATE);
  }, [form]);

  const handleJoin = useCallback(({ sessionId, username }) => {
    if (socket.disconnected) {
      alert("No se pudo conectar al servidor.");
      return;
    }

    socket.emit('join room', sessionId, username, (res) => {
      if (res.error) {
        alert(res.error);
        return;
      }

      dispatch(joinRoom(res.room, res.user));
    });
  }, [dispatch, socket]);

  const handleCreate = useCallback(({ sessionName }) => {
    if (socket.disconnected) {
      alert("No se pudo conectar al servidor.");
      return;
    }

    socket.emit('create room', sessionName, ({ room, users }) => {
      dispatch(createRoom(room, users));
    });
  }, [dispatch, socket]);

  return (
    <section>
      <h1>Scrum Poker!</h1>

      {form === Forms.JOIN ? (
        <JoinForm onSubmit={handleJoin} />
      ) : (
        <CreateForm onSubmit={handleCreate} />
      )}

      <form>
        <a href="/" onClick={switchForm}>
          {form === Forms.JOIN ? '¿Crear una sesión?' : '¿Unirse a una sesión?'}
        </a>
      </form>
    </section>
  );
}

export default Login;
