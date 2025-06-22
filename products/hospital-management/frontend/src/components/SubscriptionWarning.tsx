import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, AlertTitle, Button, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { clearSubscriptionWarning } from '../store/slices/tenantSlice';

const SubscriptionWarning: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptionWarning } = useSelector((state: RootState) => state.tenant);

  if (!subscriptionWarning?.show) {
    return null;
  }

  const handleUpgrade = () => {
    navigate('/subscription');
    dispatch(clearSubscriptionWarning());
  };

  return (
    <Collapse in={subscriptionWarning.show}>
      <Alert
        severity={subscriptionWarning.severity}
        action={
          <Button color="inherit" size="small" onClick={handleUpgrade}>
            Upgrade Now
          </Button>
        }
        onClose={() => dispatch(clearSubscriptionWarning())}
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
      >
        <AlertTitle>Subscription Notice</AlertTitle>
        {subscriptionWarning.message}
      </Alert>
    </Collapse>
  );
};

export default SubscriptionWarning;