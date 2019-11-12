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
                    <th>Nombre</th>
                    <th>Carta</th>
                </tr>
            </thead>
            <tbody>
                {props.users.map((user) =>
                    <User {...user} showResponse={props.showResponse} key={user.id} />
                )}
            </tbody>
        </table>
    );
}

export default UsersList;
