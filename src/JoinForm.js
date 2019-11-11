import React from 'react';

class JoinForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {session: '', username: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Unirse a una sesión</h3>
                <fieldset>
                    <input
                        name="session"
                        placeholder="No. de Sesión"
                        onChange={this.handleInput}
                        value={this.state.session}
                    />
                </fieldset>
                <fieldset>
                    <input
                        name="username"
                        placeholder="Tú Nombre"
                        onChange={this.handleInput}
                        value={this.state.username}
                    />
                </fieldset>
                <button>Entrar</button>
            </form>
        )
    }
}

export default JoinForm;
