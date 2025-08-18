import React from 'react';
import { Component } from 'react';

interface NotificationToastProps {
  message: string;
  duration?: number;
}

interface NotificationToastState {
  visible: boolean;
}

class NotificationToast extends Component<NotificationToastProps, NotificationToastState> {
  constructor(props: NotificationToastProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true });
    const { duration = 3000 } = this.props;
    setTimeout(this.hide, duration);
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { message } = this.props;
    const { visible } = this.state;

    return (
      <div className={`notification-toast ${visible ? 'visible' : ''}`}>
        {message}
      </div>
    );
  }
}

export default NotificationToast;      