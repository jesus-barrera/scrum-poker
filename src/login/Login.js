import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Header, Page } from '../common/layout';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';
import { joinRoom, createRoom } from '../redux/ducks/room';
import isMobile from '../common/helpers/isMobile';
import './Login.css';

const Forms = {
  JOIN: 'JOIN',
  CREATE: 'CREATE',
};

function Login({  socket }) {
  const dispatch = useDispatch();

  // Set default form. If the device is mobile, we show the join form first.
  const [form, setForm] = useState(isMobile()
    ? Forms.JOIN
    : Forms.CREATE);

  const switchForm = useCallback(() => {
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

    socket.emit('create room', sessionName, (room) => {
      dispatch(createRoom(room));
    });
  }, [dispatch, socket]);

  return (
    <Page
      header={
        false && (<Header>
          <button onClick={switchForm}>
            {form === Forms.JOIN ? 'Crear' : 'Unirse'}
          </button>
        </Header>)
      }
    >
      <h1 style={{ fontWeight: 400, textAlign: 'center' }}>Scrum Poker!</h1>

      {form === Forms.JOIN ? (
        <JoinForm onSubmit={handleJoin} />
      ) : (
        <CreateForm onSubmit={handleCreate} />
      )}
      <div>

      </div>
    </Page>
  );
}

export default Login;
