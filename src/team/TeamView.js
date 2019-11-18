import React from 'react';
import {Header, Page} from '../common/layout';
import Grid from './Grid';
import Alert from '../common/Alert';

class TeamView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            choice: null,
            connected: true
        };

        this.handleCardChange = this.handleCardChange.bind(this);
    }

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners() {
        var {socket} = this.props;

        socket.on('disconnect', () => this.handleDisconnect());
        socket.on('start voting', () => this.handleStartVoting());
        socket.on('room closed', () => this.handleRoomClosed());
        socket.on('reconnect', () => this.handleReconnect());
    }

    removeListeners() {
        var {socket} = this.props;

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

    handleRoomClosed() {
        alert('La sesión fue terminada.');
        window.location.reload(false);
    }

    handleReconnect() {
        var {socket, user, session} = this.props;

        socket.emit('join room', session.id, user.username, (res) => {
            if (res.error) {
                this.handleRoomClosed();
            }

            socket.emit('card changed', this.state.choice);
        });

        this.setState({connected: true});
    }

    handleCardChange(card) {
        this.props.socket.emit('card changed', card);

        this.setState({choice: card});
    }

    render() {
        const {user} = this.props;
        const {connected, choice} = this.state;

        return (
            <Page
                header={
                    <Header>
                        <div>{user.username}</div>
                    </Header>
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

export default TeamView;
