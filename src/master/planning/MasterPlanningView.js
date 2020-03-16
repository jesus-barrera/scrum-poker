import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import withNotifications from '../../common/withNotifications';
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
  startVoting,
  endVoting,
  leaveRoom,
} from '../../redux/ducks/room';

function formatMsg(user, message) {
  return <span>¡<b>{user.username}</b> {message}!</span>;
}

function MasterPlanningView({ socket, notify }) {
  const [results, setResults] = useState();
  const users = useSelector(state => state.users);
  const room = useSelector(state => state.room);
  const dispatch = useDispatch();

  useEffect(() => {
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
    socket.on('disconnect', () => dispatch(leaveRoom()));

    return () => {
      socket.off('user joined');
      socket.off('card changed');
      socket.off('user disconnected');
      socket.off('user connected');
      socket.off('user left');
      socket.off('disconnect');
    };
  }, [socket, dispatch, users, notify]);

  const handleStartVoting = useCallback(
    () => {
      socket.emit('start voting');
      dispatch(startVoting());
    },
    [dispatch, socket],
  );

  const handleEndVoting = useCallback(
    () => {
      socket.emit('end voting');
      dispatch(endVoting());
      setResults(calcResults(users));
    },
    [dispatch, socket, users],
  );

  const handleLogout = useCallback(() => {
    socket.emit('close room', () => dispatch(leaveRoom()));
  }, [dispatch, socket]);

  return (
    <MasterPage onLogout={handleLogout}>
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
