import React from 'react';
import { FileText } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const NCQPlatformSRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="ncq-platform-srs.md"
      title={t('md_pages.ncq_platform_srs')}
      description={t('md_pages.srs_desc')}
      icon={FileText}
    />
  );
};

export default NCQPlatformSRSPage;