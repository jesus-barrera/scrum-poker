import React from 'react';

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {session: ''};

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

        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Crear nueva sesión</h3>
                <fieldset>
                    <input
                        onChange={this.handleInput}
                        value={this.state.session}
                        name="session"
                        placeholder="Nombre de la Sesión"
                    />
                </fieldset>

                <button>Crear</button>
            </form>
        )
    }
}

export default CreateForm;
