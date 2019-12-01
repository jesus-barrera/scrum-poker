import React from 'react';
import Alert from '../../common/Alert';
import AppContext from '../../common/AppContext';
import TeamPage from '../TeamPage';
import Grid from './Grid';

class TeamPlanningView extends React.Component {
    static contextType = AppContext;

    constructor(props, context) {
        super(props, context);

        this.handleCardChange = this.handleCardChange.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            choice: null,
            connected: this.context.socket.connected,
            voting: this.context.room.voting
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
        var {socket, handleRoomClosed, user} = this.context;

        socket.on('disconnect', () => this.handleDisconnect());
        socket.on('start voting', () => this.handleStartVoting());
        socket.on('end voting', () => this.handleEndVoting());
        socket.on('room closed', handleRoomClosed);
        socket.on('reconnect', () => this.handleReconnect());

        socket.io.opts.query = { userId: user.id };
    }

    removeListeners() {
        var {socket} = this.context;

        socket.off('disconnect');
        socket.off('start voting');
        socket.off('end voting');
        socket.off('room closed');
        socket.off('reconnect');

        socket.io.opts.query = {};
    }

    handleDisconnect() {
        this.setState({connected: false});
    }

    handleStartVoting() {
        this.setState({choice: null, voting: true});
    }

    handleEndVoting() {
        this.setState({voting: false});
    }

    handleReconnect() {
        var {socket, room, user, handleRoomClosed} = this.context;

        socket.emit('join room', room.id, user.username, (res) => {
            if (res.error) {
                handleRoomClosed();
            } else {
                socket.emit('card changed', this.state.choice);
                this.setState({connected: true, voting: res.room.voting});
            }
        });
    }

    handleCardChange(card) {
        this.context.socket.emit('card changed', card);
        this.setState({choice: card});
    }

    logout(e) {
        e.preventDefault();

        this.context.socket.emit('leave room', () => {
            this.context.clearState();
        });
    }

    render() {
        const {connected, choice, voting} = this.state;

        var notice = (! connected && <Alert type="error">Sin conexion!</Alert>)
            || (! voting && <Alert type="info">Votación cerrada!</Alert>);

        return (
            <TeamPage onLogout={this.logout}>
                <div className="alert-container">
                    {notice}
                </div>

                <Grid
                    onCardChange={this.handleCardChange}
                    choice={choice}
                />
            </TeamPage>
        );
    }
}

export default TeamPlanningView;
