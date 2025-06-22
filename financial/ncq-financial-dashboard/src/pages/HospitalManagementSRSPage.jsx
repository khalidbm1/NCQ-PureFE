import React from 'react';
import { Hospital } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const HospitalManagementSRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="hospital-management-srs.md"
      title={t('md_pages.hospital_management_srs')}
      description={t('md_pages.srs_desc')}
      icon={Hospital}
    />
  );
};

export default HospitalManagementSRSPage;