import React from 'react';
import Card from './Card';
import './Grid.css';

const cards = [
    '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'Inf', '?', 'Bk'
];

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(card) {
        // If the card is the one already selected, unselected it, or select it
        // if not.
        this.props.onCardChange(card === this.props.choice ? null : card);
    }

    render() {
        return (
            <div className="grid grid-4-cols">
                {cards.map((label, key) => (
                    <Card
                        key={key}
                        onClick={this.handleClick}
                        label={label}
                        active={label === this.props.choice}
                    />
                ))}
            </div>
        );
    }
};

export default Grid;
