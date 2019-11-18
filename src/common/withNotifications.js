import React from 'react';
import Notifications from './Notifications';

const ALERT_TIMEOUT = 3000;

// Provides a component with a notify prop that allows it to fire non-blocking
// notifications. Notifications are displayed for ALERT_TIMEOUT milliseconds and
// removed automatically, such notifications are stacked if notify is called
// multiple times.
function withNotifications(Component) {
    var count = 0;
    var alerts = [];
    var onChange = (data) => {};

    function notify(alert) {
        alert.id = ++count;
        alerts = alerts.concat(alert);
        setTimeout(() => remove(alert), ALERT_TIMEOUT);

        onChange(alerts);
    }

    function remove(alert) {
        alerts.splice(alerts.indexOf(alert), 1);
        alerts = [...alerts];

        onChange(alerts);
    }

    // This component subscribes to the changes in the alerts array inside
    // this scope, so whenever the array changes the component updates itself.
    class AddedNotifications extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                alerts: alerts
            };
        }

        componentDidMount() {
            // Update notifications when the source data change
            onChange = (alerts) => this.setState({alerts});
        }

        render() {
            return <Notifications items={this.state.alerts} />
        }
    }

    // HOC that renders the wrapped component along with the notifications
    // container. The notify method is passed to Component. When Component calls
    // notify it triggers the onChange callback wich updates the Notifications
    // state, thus rendering the alerts. Notice that Notifications renders
    // independently from Component, so when an alert is fired, the Component
    // itself is not rerendered.
    function WithNotifications (props) {
        return (
            <>
                <AddedNotifications />
                <Component
                    notify={notify}
                    {...props}
                />
            </>
        );
    }

    return WithNotifications;
}

export default withNotifications;
