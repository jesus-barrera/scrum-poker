import React from 'react';
import { ReactComponent as RemoveIcon } from '../media/icons/remove-user.svg';
import './UsersList.css';

function User({ id, index, connected, username, card, voting, onRemove }) {
  if (voting) {
    card = card ? '[Listo]' : '[Esperando...]';
  } else {
    card = card ? card : '[Sin respuesta]';
  }

  return (
    <tr className={"user " + (!connected ? 'offline' : '')}>
      <td className="user__id">{index + 1}</td>
      <td className="user__name">
        {/* !voting && <div className="user__status" /> */}
        {username}
      </td>
      <td className="user__card">{(connected && card) || '[Desconectado]'}</td>
      <td className="user__remove">
        {voting && (
          <button onClick={() => onRemove(id)} type="button">
            <RemoveIcon />
          </button>
        )}
      </td>
    </tr>
  );
}

function UsersList({ users, voting, onRemoveUser }) {
  return (
    <table className="users-list">
      <thead>
        <tr>
          <th className="user__id">#</th>
          <th className="user__name">Nombre</th>
          <th className="user__card">Carta</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(users).map((id, index) =>
          <User {...users[id]}
            key={id}
            id={id}
            index={index}
            voting={voting}
            onRemove={onRemoveUser}
          />
        )}
      </tbody>
    </table>
  );
}

export default UsersList;
