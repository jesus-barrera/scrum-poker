import React from 'react';

function NoUsersMessage({name, id}) {
  return (
    <div className="no-users">
      <h2>{name || 'Scrum Poker'} - ID: {id}</h2>
      <p>Esperando a que los miembros del equipo se unan.</p>
      <p>Usa el ID de la sesión <b>{id}</b> para unirte a la sala.</p>
    </div>
  );
}

export default React.memo(NoUsersMessage);
