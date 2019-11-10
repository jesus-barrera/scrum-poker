import React from 'react';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { active: false };
    }

    toggle(e) {
        e.preventDefault();
        this.setState({ active: ! this.state.active });
    }

    render() {
        var className = 'card' + (this.state.active ? ' active' : '');

        return (
            <div
                className={className}
                onClick={this.toggle}
            >
                <div className="card__name">
                    {this.props.name}
                </div>

                <div className="card__content">
                    {this.props.value}
                </div>
            </div>
        );
    }
}

export default Card;
