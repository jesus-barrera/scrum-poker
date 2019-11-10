import React from 'react';
import Card from './Card';
import './cards.css';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.cards = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'Inf', '?', 'Bk'];
        this.state = {
            voting: false
        };
    }

    reset() {
        // set all cards to unselected
    }

    render() {
        return (
            <div className="grid grid-4-cols">
                {this.cards.map((card, key) => (
                    <Card key={key} value={card} />
                ))}
            </div>
        );
    }
};

export default Grid;
