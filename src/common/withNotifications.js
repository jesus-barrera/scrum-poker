import React from 'react';
import Notifications from './Notifications';

const ALERT_TIMEOUT = 3000;

function withNotifications(Component) {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.notify = this.notify.bind(this);

            this.state = {
                alerts: []
            };
        }

        notify(alert) {
            this.setState({alerts: this.state.alerts.concat(alert)});
            setTimeout(() => this.remove(alert), ALERT_TIMEOUT);
        }

        remove(alert) {
            let alerts = this.state.alerts;
            let index = alerts.indexOf(alert);

            alerts.splice(index, 1);

            this.setState({alerts: [...alerts]});
        }

        render () {
            return (
                <>
                    <Notifications items={this.state.alerts} />
                    <Component notify={this.notify} {...this.props} />
                </>
            );
        }
    }
}

export default withNotifications;
