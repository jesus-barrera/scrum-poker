import React from 'react';
import Card from './Card';
import './cards.css';

class Grid extends React.Component {
    render() {
        var cards = ['0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'Inf', '?', 'Bk'];

        return (
            <div className="grid">
                {cards.map((label, key) => (<Card key={key} label={label} />))}
            </div>
        );
    }
};

export default Grid;
