import React from 'react';

function NoUsersMessage(props) {
    return (
        <div className="no-users">
            <h3>¿Dónde están todos?</h3>
            <p>Esperando a que los miembros del equipo se unan.</p>
            <p>Usa el ID de la sesión <b>{props.sessionId}</b> para unirte a la sala.</p>
        </div>
    );
}

export default React.memo(NoUsersMessage);
