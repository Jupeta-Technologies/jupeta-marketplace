import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCcVisa, 
  faCcMastercard, 
  faCcDiscover, 
  faCcPaypal, 
  faCcApplePay 
} from '@fortawesome/free-brands-svg-icons';

const PaymentMethods: React.FC = () => {
  const paymentMethods = [
    { icon: faCcVisa, name: 'Visa' },
    { icon: faCcMastercard, name: 'Mastercard' },
    { icon: faCcDiscover, name: 'Discover' },
    { icon: faCcPaypal, name: 'PayPal' },
    { icon: faCcApplePay, name: 'Apple Pay' }
  ];

  return (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      {paymentMethods.map((method, index) => (
        <FontAwesomeIcon 
          key={index}
          icon={method.icon} 
          size="2x" 
          style={{ color: '#666' }}
          title={method.name}
        />
      ))}
    </div>
  );
};

export default PaymentMethods; 
