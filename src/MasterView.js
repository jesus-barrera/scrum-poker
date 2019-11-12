import React from 'react';
import {Page, Header} from './layout';
import UsersList from './UsersList';
import Results from './Results';
import './MasterView.css';
import calcResults from './calcResults';
import io from 'socket.io-client';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartVoting = this.handleStartVotin.bind(this);
        this.handleEndVoting = this.handleEndVoting.bind(this);

        this.state = {
            voting: false,
            users: [],
            results: null
        };
    }

    componentDidMount() {
        var socket = io();

        socket.on('user:connect', (name, id) => {
            var {users} = this.state;
            var newUser = { name, id };

            users = users.concat(newUser);

            this.setState({ users });
        });

        socket.on('user:select-card', (id, card) => {
            var {users} = this.state;
            var i = users.findIndex((user) => user.id === id);

            users[i].card = card;

            this.setState({ users: users.concat() });
        });

        socket.on('user:disconnect', (id) => {
            var {users} = this.state;
            var i = users.findIndex((user) => user.id === id);

            users.splice(i, 1);

            this.setState({ users: users.concat() });
        });

        this.socket = socket;
    }

    handleStartVoting() {
        this.state.users.forEach((user) => user.card = null);

        this.setState({
            users: this.state.users,
            results: null,
            voting: true
        });
    }

    handleEndVoting() {
        this.setState({
            results: calcResults(this.state.users),
            voting: false
        });
    }

    render() {
        return (
            <Page
                header={<MasterViewHeader session={this.props.session} />}
            >
                {this.state.users.length == 0 ?
                    <NoUsersMessage sessionId={session.id} /> :
                    <Content
                        onStartVoting={this.handleStartVoting}
                        onEndVoting={this.handleEndVoting}
                        voting={this.state.voting}
                        results={this.state.results}
                        users={this.state.users}
                    />
                }
            </Page>
        );
    }
}

function MasterViewHeader(props) {
    return (
        <Header>
            <div className="session">
                <span className="session__name">
                    {props.session.name} |
                </span>
                <span className="session__id">
                    <b> ID</b>: {props.session.id}
                </span>
            </div>
        </Header>
    );
}

function NoUsersMessage(props) {
    return (
        <div className="no-users">
            <h3>¿Ontán todos?</h3>
            <p>Esperando a que los miembros del equipo se unan.</p>
            <p>Usa el ID de la sesión <b>{props.sessionId}</b> para unirte a la sala.</p>
        </div>
    );
}

function Content(props) {
    var button = this.props.voting
        ? <button onClick={this.props.onEndVoting}>Terminar Votación</button>
        : <button onClick={this.props.onStartVoting}>Nueva Votación</button>;

    return (
        <div>
            {this.props.results && <Results {...this.props.results} />}
            <UsersList
                users={this.props.users}
                showResponse={! this.props.voting}
            />
            <div className="actions">
                {button}
            </div>
        </div>
    );
}

export default TeamView;
