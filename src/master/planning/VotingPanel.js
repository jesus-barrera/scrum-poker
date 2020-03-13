import React from 'react';
import { useSelector } from 'react-redux';
import UsersList from '../UsersList';

function VotingPanel({ onEndVoting }) {
  const users = useSelector(state => state.users);

  return (
    <>
      <UsersList
        users={users}
        showResponse={false}
      />
      <div className="actions">
        <button onClick={onEndVoting}>Terminar Votación</button>
      </div>
    </>
  );
}

export default VotingPanel;
