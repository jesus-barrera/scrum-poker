import React from 'react';
import Login from './Login.js';
import TeamView from './TeamView.js';
import MasterView from './MasterView.js';
import Alert from './ui/Alert.js';
import io from 'socket.io-client';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleJoin = this.handleJoin.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.alert = this.alert.bind(this);

        this.state = {
            view: null,
            session: null,
            user: null,
            alerts: []
        };

        this.socket = io(":8080");

        this.socket.on('disconnect', () => {
            this.alert({type: "error", message: "Se perdió la conexión!"});
        });

        this.socket.on('reconnect', () => {
            this.alert({type: "success", message: "Conectado!"});
        });
    }

    alert(type, message) {
        var alert = {type, message};

        this.setState({
            alerts: this.state.alerts.concat(alert)
        });

        setTimeout(() => {
            this.setState((props, state) => {
                let alerts = this.state.alerts;
                let index = alerts.indexOf(alert);

                alerts.splice(index, 1);

                return {alerts: [...alerts]};
            });
        }, 3000);
    }

    handleJoin(data) {
        var {sessionId, username} = data;

        if (this.socket.disconnected) {
            alert("No se pudo conectar al servidor.");
            return;
        }

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

        if (this.socket.disconnected) {
            alert("No se pudo conectar al servidor.");
            return;
        }

        this.socket.emit('create room', sessionName, (session) => {
            this.setState({ view: 'master', session: session });
        });
    }

    render() {
        const {view, session, user} = this.state;

        var alerts = (
            <div className="alert-container">
                {this.state.alerts.map((alert, index) =>
                    <Alert type={alert.type} key={index}>{alert.message}</Alert>
                )}
            </div>
        );

        if (! session) {
            return(
            <div>
                {alerts}
                <Login
                    handleJoin={this.handleJoin}
                    handleCreate={this.handleCreate} />
            </div>);
        }

        return (
            <div>
                {alerts}
                {view === 'master'
                    ? <MasterView
                        alert={this.alert}
                        socket={this.socket}
                        session={session} />

                    : <TeamView
                        socket={this.socket}
                        session={session}
                        user={user} />}
            </div>
        );
    }
}

export default App;
