import React from 'react';
import {Page, Header} from './layout';
import UsersList from './UsersList';
import Results from './Results';
import './MasterView.css';
import calcResults from './calcResults';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartVoting = this.handleStartVoting.bind(this);
        this.handleEndVoting = this.handleEndVoting.bind(this);

        this.state = {
            voting: true,
            users: [],
            results: null
        };
    }

    componentDidMount() {
        var socket = this.props.socket;

        socket.on('user joined', (user) => {
            this.setState({ users: this.state.users.concat(user) });
        });

        socket.on('card changed', (id, card) => {
            var {users} = this.state;
            var i = users.findIndex((user) => user.id === id);

            users[i].card = card;

            this.setState({ users: users.concat() });
        });

        socket.on('user left', (id) => {
            var {users} = this.state;
            var i = users.findIndex((user) => user.id === id);

            users.splice(i, 1);

            this.setState({ users: users.concat() });
        });
    }

    handleStartVoting() {
        this.state.users.forEach((user) => user.card = null);

        this.setState({
            results: null,
            voting: true
        });

        this.props.socket.emit('start voting');
    }

    handleEndVoting() {
        this.setState({
            results: calcResults(this.state.users),
            voting: false
        });
    }

    render() {
        const {session} = this.props;

        return (
            <Page
                header={<MasterViewHeader session={session} />}
            >
                {this.state.users.length === 0 ?
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
    var button = props.voting
        ? <button onClick={props.onEndVoting}>Terminar Votación</button>
        : <button onClick={props.onStartVoting}>Nueva Votación</button>;

    return (
        <div>
            {props.results && <Results {...props.results} />}
            <UsersList
                users={props.users}
                showResponse={! props.voting}
            />
            <div className="actions">
                {button}
            </div>
        </div>
    );
}

export default TeamView;
