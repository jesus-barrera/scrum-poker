import React from 'react';
import { useSelector } from 'react-redux';
import UsersList from '../UsersList';

function VotingPanel({ onEndVoting, onRemoveUser }) {
  const users = useSelector(state => state.users);

  return (
    <>
      <UsersList
        users={users}
        onRemoveUser={onRemoveUser}
        voting
      />
      <div className="actions">
        <button onClick={onEndVoting}>Terminar Votación</button>
      </div>
    </>
  );
}

export default VotingPanel;
