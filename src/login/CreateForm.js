import React from 'react';

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sessionName: ''};

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
        if (! this.state.sessionName) {
            alert("Datos incorrectos!");
            return;
        }

        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Crear nueva sesión</h3>
                <fieldset>
                    <input
                        onChange={this.handleInput}
                        onBlur={this.trimInput}
                        value={this.state.sessionName}
                        name="sessionName"
                        placeholder="Nombre de la sesión"
                    />
                </fieldset>

                <button>Crear</button>
            </form>
        )
    }
}

export default CreateForm;
