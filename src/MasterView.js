import React from 'react';
import {Page, Header} from './layout';
import UsersList from './UsersList';
import Results from './Results';
import './MasterView.css';
import {calcResults, getEmptyResults} from './calcResults';
import io from 'socket.io-client';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleResults = this.handleResults.bind(this);
        this.countVote = this.countVote.bind(this);

        this.state = {
            voting: true,
            users: [],
            results: getEmptyResults()
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
            results: getEmptyResults(),
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
        const {session} = this.props;

        if (this.state.users.length === 0) {
            return (
                <div className="no-users">
                    <h3>¿Ontán todos?</h3>
                    <p>Esperando a que los miembros del equipo se unan.</p>
                    <p>Usa el ID de la sesión <b>{session.id}</b> para unirte a la sala.</p>
                </div>
            );
        }

        var results = ! this.state.voting
            ? <Results {...this.state.results} />
            : null;

        var button = (this.state.voting)
            ? <button onClick={this.handleResults}>Terminar Votación</button>
            : <button onClick={this.handleReset}>Nueva Votación</button>;

        return (
            <Page
                header={
                    <Header>
                        <div className="session">
                            <span className="session__name">
                                {session.name} |
                            </span>
                            <span className="session__id">
                                <b> ID</b>: {session.id}
                            </span>
                        </div>
                    </Header>
                }
            >
                {results}
                <UsersList
                    users={this.state.users}
                    showResponse={! this.state.voting}
                />
                <div className="actions">
                    {button}
                </div>
            </Page>
        );
    }
}

export default TeamView;
