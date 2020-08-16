import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../../common/Alert';
import TeamPage from '../TeamPage';
import Grid from './Grid';

import {
  startVoting,
  endVoting,
  leaveRoom,
  joinRoom,
} from '../../redux/ducks/room';

function TeamPlanningView({ socket }) {
  const [choice, setChoice] = useState(null);
  const [connected, setConnected] = useState(socket.connected);
  const user = useSelector((state) => state.user);
  const room = useSelector((state) => state.room);
  const dispatch = useDispatch();

  // 'join room' event callback
  const joinedRoom = useCallback((res) => {
    if (res.error) {
      dispatch(leaveRoom());
    } else {
      // If the current poll hasn't change, update the selected card. If a
      // new poll started, the card is cleared.
      if (res.room.count === room.count) {
        socket.emit('card changed', choice);
      } else {
        setChoice(null);
      }

      setConnected(true);
      dispatch(joinRoom(res.room, res.user));
    }
  }, [socket, dispatch, choice, room]);

  // Adds socket events handlers
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join room', room.id, user.username, joinedRoom);
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('start voting', () => {
      setChoice(null);
      dispatch(startVoting());
    });

    socket.on('end voting', () => dispatch(endVoting()));
    socket.on('room closed', () => dispatch(leaveRoom()));

    socket.io.opts.query = { userId: user.id };

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('start voting');
      socket.off('end voting');
      socket.off('room closed');

      socket.io.opts.query = {};
    }
  }, [socket, dispatch, room, user, joinedRoom]);

  // Opens socket if necessary
  useEffect(() => {
    // Check if the socket should be opened manually, this means that the user
    // entered directly to this page (due to a previous saved state) and
    // must be re added to the room.
    if (socket.disconnected) {
      socket.open();
    }
  }, [socket]);

  // Adds handler to leave room before page is closed
  useEffect(() => {
      const handleBeforeUnload = (e) => {
          if (socket.connected) {
            socket.emit('leave room', () => {});
          }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [socket]);

  // Handle card changed
  const handleCardChange = useCallback((card) => {
    if (socket.connected) {
      if (card === 'Bk') {
        socket.emit('suggest break');
      } else if (room.voting) {
        socket.emit('card changed', card);
        setChoice(card);
      }
    }
  }, [socket, room]);

  // Handle logout
  const logout = useCallback((e) => {
    e.preventDefault();

    socket.emit('leave room', () => {
      dispatch(leaveRoom());
    });
  }, [socket, dispatch]);

  var notice = (!connected && <Alert type="error">Sin conexion!</Alert>)
    || (!room.voting && <Alert type="info">Votación cerrada!</Alert>);

  return (
    <TeamPage onLogout={logout}>
      <div className="alert-container">
        {notice}
      </div>

      <Grid
        onCardChange={handleCardChange}
        choice={choice}
      />
    </TeamPage>
  );
}

export default TeamPlanningView;
