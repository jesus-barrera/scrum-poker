import React from 'react';
import Results from './Results';
import UsersList from '../UsersList';

function ResultsPanel({ onStartVoting, results }) {
  return (
    <>
      <Results {...results} />
      <UsersList
        users={results.users}
        showResponse={true}
      />
      <div className="actions">
        <button onClick={onStartVoting}>Nueva Votación</button>
      </div>
    </>
  );
}

export default ResultsPanel;
