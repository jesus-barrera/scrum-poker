import React from 'react';
import { connect } from 'react-redux';
import { Header, Page } from '../common/layout';
import JoinForm from './JoinForm';
import CreateForm from './CreateForm';
import { joinRoom, createRoom } from '../redux/ducks/room';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.handleJoin = this.handleJoin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    handleJoin(data) {
        var { sessionId, username } = data;
        var { socket, onJoin } = this.props;

        if (socket.disconnected) {
            alert("No se pudo conectar al servidor.");
            return;
        }

        socket.emit('join room', sessionId, username, (response) => {
            if (response.error) {
                alert(response.error);
                return;
            }

            onJoin(response);
        });
    }

    handleCreate(data) {
        var {sessionName} = data;
        var {socket, onCreate} = this.props;

        if (socket.disconnected) {
            alert("No se pudo conectar al servidor.");
            return;
        }

        socket.emit('create room', sessionName, onCreate);
    }

    render() {
        return (
            <Page header={<Header />}>
                <CreateForm onSubmit={this.handleCreate} />
                <JoinForm onSubmit={this.handleJoin} />
            </Page>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    onJoin: ({ room, user }) => {
      dispatch(joinRoom(room, user));
    },
    onCreate: (room) => {
      dispatch(createRoom(room));
    },
  };
}

export default connect(null, mapDispatchToProps)(Login);
