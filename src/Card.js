import React from 'react';

function Card(props) {
    return (
        <div className="card">
            <div className="card__content">
                {props.label}
            </div>
        </div>
    );
}

export default Card;
