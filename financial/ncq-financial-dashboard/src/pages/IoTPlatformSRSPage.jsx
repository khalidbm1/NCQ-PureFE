import React from 'react';
import { Zap } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const IoTPlatformSRSPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="iot-platform-srs.md"
      title={t('md_pages.iot_platform_srs')}
      description={t('md_pages.srs_desc')}
      icon={Zap}
    />
  );
};

export default IoTPlatformSRSPage;