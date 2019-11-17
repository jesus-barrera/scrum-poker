import React from 'react';

class JoinForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sessionId: '', username: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleBlur(e) {
        this.setState({
            [e.target.name]: e.target.value.trim()
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (! this.state.sessionId || ! this.state.username) {
            alert("Datos incorrectos!");
            return;
        }

        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Unirse a una sesión</h3>
                <fieldset>
                    <input
                        name="sessionId"
                        placeholder="ID de sesión"
                        onChange={this.handleInput}
                        onBlur={this.handleBlur}
                        value={this.state.sessionId}
                    />
                </fieldset>
                <fieldset>
                    <input
                        name="username"
                        placeholder="Tú nombre"
                        onChange={this.handleInput}
                        onBlur={this.handleBlur}
                        value={this.state.username}
                    />
                </fieldset>
                <button>Entrar</button>
            </form>
        )
    }
}

export default JoinForm;
