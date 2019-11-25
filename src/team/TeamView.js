import React from 'react';
import {Header, Page} from '../common/layout';
import Grid from './Grid';
import Alert from '../common/Alert';
import AppContext from '../common/AppContext';
import logoutIcon from '../assets/cerrar-sesion.svg';

class TeamView extends React.Component {
    static contextType = AppContext;

    constructor(props, context) {
        super(props, context);

        this.handleCardChange = this.handleCardChange.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            choice: null,
            connected: this.context.socket.connected
        };
    }

    componentDidMount() {
        var {socket} = this.context;

        this.addListeners();

        // Check if the socket should be opened manually, this means that the user
        // entered directly to this page (due to a previous saved state) and
        // must be re added to the room.
        if (socket.disconnected) {
            socket.once('connect', () => this.handleReconnect());
            socket.open();
        }
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners() {
        var {socket, handleRoomClosed} = this.context;

        socket.on('disconnect', () => this.handleDisconnect());
        socket.on('start voting', () => this.handleStartVoting());
        socket.on('room closed', handleRoomClosed);
        socket.on('reconnect', () => this.handleReconnect());
    }

    removeListeners() {
        var {socket} = this.context;

        socket.off('disconnect');
        socket.off('start voting');
        socket.off('room closed');
        socket.off('reconnect');
    }

    handleDisconnect() {
        this.setState({connected: false});
    }

    handleStartVoting() {
        this.setState({choice: null});
    }

    handleReconnect() {
        var {socket, room, user, handleRoomClosed} = this.context;

        socket.emit('join room', room.id, user.username, (res) => {
            if (res.error) {
                handleRoomClosed();
            } else {
                socket.emit('card changed', this.state.choice);
            }
        });

        this.setState({connected: true});
    }

    handleCardChange(card) {
        this.context.socket.emit('card changed', card);
        this.setState({choice: card});
    }

    logout(e) {
        e.preventDefault();
        this.context.socket.emit('leave room');
        this.context.clearState();
    }

    render() {
        const {user} = this.context;
        const {connected, choice} = this.state;

        return (
            <Page
                header={
                    <TeamViewHeader
                        user={user}
                        onLogout={this.logout}
                    />
                }
            >
                {! connected && (
                    <div className="alert-container">
                        <Alert type="error">Sin conexión!</Alert>
                    </div>
                )}
                <Grid
                    onCardChange={this.handleCardChange}
                    choice={choice}
                />
            </Page>
        );
    }
}

function TeamViewHeader(props) {
    return (
        <Header>
            <div className="header__item">
                <span className="header__username">{props.user.username}</span>
                <img
                    className="header__logout"
                    src={logoutIcon}
                    onClick={props.onLogout}
                    alt="logout"
                />
            </div>
        </Header>
    );
}

export default TeamView;
