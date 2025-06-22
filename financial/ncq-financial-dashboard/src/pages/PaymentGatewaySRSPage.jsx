import React from 'react';
import { CreditCard } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const PaymentGatewaySRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="payment-gateway-srs.md"
      title={t('md_pages.payment_gateway_srs')}
      description={t('md_pages.srs_desc')}
      icon={CreditCard}
    />
  );
};

export default PaymentGatewaySRSPage;