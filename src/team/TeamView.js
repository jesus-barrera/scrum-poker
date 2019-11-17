import React from 'react';
import {Header, Page} from '../common/layout';
import Grid from './Grid';

class TeamView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choice: null
        };
        this.handleCardChange = this.handleCardChange.bind(this);
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners() {
        var {user, session, socket} = this.props;

        socket.on('start voting', () => {
            this.setState({ choice: null });
        });

        socket.on('room closed', () => { this.handleRoomClosed() });

        socket.on('reconnect', () => {
            socket.emit('join room', session.id, user.username, (res) => {
                if (res.error) {
                    this.handleRoomClosed();
                }

                socket.emit('card changed', this.state.choice);
            });
        });
    }

    handleRoomClosed() {
        alert('La sesión fue terminada.');
        window.location.reload(false);
    }

    handleCardChange(card) {
        this.props.socket.emit('card changed', card);

        this.setState({ choice: card });
    }

    render() {
        const {user} = this.props;

        return (
            <Page
                header={
                    <Header>
                        <div>{user.username}</div>
                    </Header>
                }
            >
                <Grid
                    onCardChange={this.handleCardChange}
                    choice={this.state.choice}
                />
            </Page>
        );
    }
}

export default TeamView;
