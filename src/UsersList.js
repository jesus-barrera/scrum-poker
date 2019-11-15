import React from 'react';
import './UsersList.css';

function User(props) {
    var card;

    if (props.showResponse) {
        card = props.card ? props.card : '[Sin respuesta]';
    } else {
        card = props.card ? '[Listo]' : '[Esperando...]';
    }

    return (
        <tr className="user">
            <td className="user__id">{props.index + 1}</td>
            <td className="user__name">{props.username}</td>
            <td className="user__card">{card}</td>
        </tr>
    );
}

function UsersList(props) {
    return (
        <table className="users-list">
            <thead>
                <tr>
                    <th className="user__id">No.</th>
                    <th className="user__name">Nombre</th>
                    <th className="user__card">Carta</th>
                </tr>
            </thead>
            <tbody>
                {props.users.map((user, index) =>
                    <User {...user}
                        index={index}
                        showResponse={props.showResponse}
                        key={user.id} />
                )}
            </tbody>
        </table>
    );
}

export default UsersList;
