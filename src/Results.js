import React from 'react';
import './Results.css';

function Results(props) {
    return (
        <div className="results">
            <div className="results__summary">
                <div>
                    <b>{props.mode.cards.length > 1 ? 'Empate' : 'Moda'}: </b>
                    {props.mode.count > 0 &&
                        <span>
                            {props.mode.cards.join(', ')} (x{props.mode.count})
                        </span>
                    }
                </div>
                <div><b>Min: </b> {props.min}</div>
                <div><b>Máx: </b> {props.max}</div>
            </div>
            <table className="results__table">
                <thead>
                    <tr>
                        <th>Carta</th>
                        <th>Votos</th>
                    </tr>
                </thead>
                <tbody>
                    {props.cards.map((card, key) => (
                        <tr key={key}>
                            <td>{card.card}</td>
                            <td>x{card.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Results;
