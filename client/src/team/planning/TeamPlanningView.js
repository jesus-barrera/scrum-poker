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

  useEffect(() => {
    function handleConnect() {
      socket.emit('rejoin room', room.id, user.username, (res) => {
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
      });
    }

    socket.on('disconnect', () => setConnected(false));

    socket.on('start voting', () => {
      setChoice(null);
      dispatch(startVoting());
    });

    socket.on('end voting', () => dispatch(endVoting()));
    socket.on('room closed', () => dispatch(leaveRoom()));
    socket.on('connect', handleConnect);

    socket.io.opts.query = { userId: user.id };

    return () => {
      socket.off('disconnect');
      socket.off('start voting');
      socket.off('end voting');
      socket.off('room closed');
      socket.off('connect');

      socket.io.opts.query = {};
    }
  }, [socket, dispatch, room, user, choice]);

  useEffect(() => {
    // Check if the socket should be opened manually, this means that the user
    // entered directly to this page (due to a previous saved state) and
    // must be re added to the room.
    if (socket.disconnected) {
      socket.open();
    }
  }, [socket]);

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
