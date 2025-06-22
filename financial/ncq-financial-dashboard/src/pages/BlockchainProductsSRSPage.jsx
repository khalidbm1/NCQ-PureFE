import React from 'react';
import { FileText } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const BlockchainProductsSRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="blockchain-products-srs.md"
      title={t('md_pages.blockchain_products_srs')}
      description={t('md_pages.srs_desc')}
      icon={FileText}
    />
  );
};

export default BlockchainProductsSRSPage;