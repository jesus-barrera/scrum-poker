import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { notify, Toast } from '../../toast';
import NoUsersMessage from '../NoUsersMessage';
import MasterPage from '../MasterPage';
import ResultsPanel from './ResultsPanel';
import VotingPanel from './VotingPanel';
import calcResults from './calcResults';
import './MasterPlanningView.css';

import {
  addUser,
  removeUser,
  setUserCard,
  setUserOffline,
  setUserOnline,
} from '../../redux/ducks/users';

import {
  createRoom,
  startVoting,
  endVoting,
  leaveRoom,
} from '../../redux/ducks/room';

function userText(user, text) {
  return <span><b>{user.username}</b> {text}!</span>;
}

function MasterPlanningView({ socket }) {
  const users = useSelector(state => state.users);
  const room = useSelector(state => state.room);
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(socket.connected);
  const [results, setResults] = useState(calcResults(users));

  useEffect(() => {
    function handleConnect() {
      socket.emit('recover room', room.id, (res) => {
        if (res.error) {
          dispatch(leaveRoom());
        } else {
          setConnected(true);
          dispatch(createRoom(res.room, res.users));
        }
      });
    }

    socket.on('user joined', (user) => dispatch(addUser(user)));

    socket.on('card changed', (id, card) => {
      dispatch(setUserCard(id, card));
    });

    socket.on('suggest break', (id) => {
      notify({ type: 'info', text: userText(users[id], 'sugiere un descanso')});
    });

    socket.on('user left', (id) => {
      notify({ type: 'info', text: userText(users[id], 'abandonó la sesión') });

      dispatch(removeUser(id));
    });

    socket.on('user disconnected', (id) => dispatch(setUserOffline(id)));
    socket.on('user connected', (id) => dispatch(setUserOnline(id)));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect', handleConnect);

    socket.io.opts.query = { hostId: room.hostId };

    return () => {
      socket.off('user joined');
      socket.off('card changed');
      socket.off('suggest break');
      socket.off('user disconnected');
      socket.off('user connected');
      socket.off('user left');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, [socket, dispatch, users, room]);

  useEffect(() => {
    // Check if the socket should be opened manually, this means that the user
    // entered directly to this page (due to a previous saved state) and
    // must be re added to the room.
    if (socket.disconnected) {
      socket.open();
    }
  }, [socket]);

  const handleStartVoting = useCallback(
    () => {
      if (!socket.connected) return;

      socket.emit('start voting');
      dispatch(startVoting());
    },
    [dispatch, socket],
  );

  const handleEndVoting = useCallback(
    () => {
      if (!socket.connected) return;

      socket.emit('end voting');
      dispatch(endVoting());
      setResults(calcResults(users));
    },
    [dispatch, socket, users],
  );

  const handleLogout = useCallback(() => {
    if (!socket.connected) return;

    socket.emit('close room', () => dispatch(leaveRoom()));
  }, [dispatch, socket]);

  const handleRemoveUser = useCallback((id) => {
    socket.emit('remove user', id, () => {
      dispatch(removeUser(id));
    });
  }, [dispatch, socket]);

  return (
    <MasterPage onLogout={handleLogout}>
      {!connected && (
        <Toast type="error">Sin Conexion! Conenctando con Scrum Poker!...</Toast>
      )}

      {room.voting && Object.keys(users).length === 0 ? (
        <NoUsersMessage name={room.name} id={room.id} />
      ) : room.voting ? (
        <VotingPanel
          onEndVoting={handleEndVoting}
          onRemoveUser={handleRemoveUser}
        />
      ) : (
        <ResultsPanel
          results={results}
          onStartVoting={handleStartVoting}
        />
      )}
    </MasterPage>
  );
}

export default MasterPlanningView;
