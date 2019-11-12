import React from 'react';
import Login from './Login.js';
import TeamView from './TeamView.js';
import MasterView from './MasterView.js';
import io from 'socket.io-client';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleJoin = this.handleJoin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);

        this.state = {
            view: null,
            session: null,
            user: null
        };

        this.socket = io(":8080");
    }

    handleJoin(data) {
        var {sessionId, username} = data;

        this.socket.emit('join room', sessionId, username, (res) => {
            if (res.error) {
                alert(res.error);
            } else {
                this.setState({
                    view: 'team',
                    session: res,
                    user: { username: data.username }
                });
            }
        });
    }

    handleCreate(data) {
        var {sessionName} = data;

        this.socket.emit('create room', sessionName, (session) => {
            this.setState({ view: 'master', session: session });
        });
    }

    render() {
        const {view, session, user} = this.state;

        if (! session) {
            return <Login
                handleJoin={this.handleJoin}
                handleCreate={this.handleCreate} />
        }

        return (
            view === 'master'
                ? <MasterView
                    socket={this.socket}
                    session={session} />
                : <TeamView
                    socket={this.socket}
                    session={session}
                    user={user} />
        );
    }
}

export default App;
