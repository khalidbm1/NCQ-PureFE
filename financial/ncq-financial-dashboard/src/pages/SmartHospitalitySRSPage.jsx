import React from 'react';
import { Building2 } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const SmartHospitalitySRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="smart-hospitality-srs.md"
      title={t('md_pages.smart_hospitality_srs')}
      description={t('md_pages.srs_desc')}
      icon={Building2}
    />
  );
};

export default SmartHospitalitySRSPage;