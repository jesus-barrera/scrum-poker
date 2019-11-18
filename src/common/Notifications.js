import React from 'react';
import Alert from './Alert';

function Notifications(props) {
    return (
        <div className="alert-container">
            {props.items.map((alert, index) =>
                <Alert type={alert.type} key={index}>{alert.message}</Alert>
            )}
        </div>
    );
}

export default Notifications;
