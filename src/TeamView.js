import React from 'react';
import {Header, Page} from './layout';
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
        this.addListeners(this.props.socket);
    }

    addListeners(socket) {
        socket.on('start voting', () => {
            this.setState({ choice: null });
        });

        socket.on('room closed', () => {
            alert('La sesión ha sido terminada.');
        });

        socket.on('reconnect', () => {
            socket.emit('join room', this.props.session.id, username);
        });

        socket.on('reconnect_error', () => {
            alert('Error al reconectar.');
        });
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
