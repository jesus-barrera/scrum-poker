import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withNotifications from '../../common/withNotifications';
import Alert from '../../common/Alert';
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

function formatMsg(user, message) {
  return <span>¡<b>{user.username}</b> {message}!</span>;
}

function MasterPlanningView({ socket, notify }) {
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
      if (card === 'Bk') {
        notify({ type: 'info', message: formatMsg(users[id], 'sugiere un descanso')});
      }

      dispatch(setUserCard(id, card));
    });

    socket.on('user left', (id) => {
      notify({ type: 'info', message: formatMsg(users[id], 'abandonó la sesión') });

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
      socket.off('user disconnected');
      socket.off('user connected');
      socket.off('user left');
      socket.off('disconnect');
      socket.off('connect');
    };
  }, [socket, dispatch, users, room, notify]);

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

  return (
    <MasterPage onLogout={handleLogout}>
      <div className="alert-container">
        {!connected && <Alert type="error">Sin conexion!</Alert>}
      </div>

      {room.voting && Object.keys(users).length === 0 ? (
        <NoUsersMessage sessionId={room.id} />
      ) : room.voting ? (
        <VotingPanel onEndVoting={handleEndVoting} />
      ) : (
        <ResultsPanel results={results} onStartVoting={handleStartVoting} />
      )}
    </MasterPage>
  );
}

export default withNotifications(MasterPlanningView);
