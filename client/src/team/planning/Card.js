import React from 'react';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(this.props.label);
    }

    render() {
        return (
            <div
                className={'card' + (this.props.active ? ' active' : '')}
                onClick={this.handleClick}
            >
                <div className="card__name">
                    {this.props.name}
                </div>

                <div className="card__content">
                    {this.props.label}
                </div>
            </div>
        );
    }
}

export default Card;
