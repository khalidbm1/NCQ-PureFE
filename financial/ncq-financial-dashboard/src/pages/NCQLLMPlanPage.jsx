import React from 'react';
import { Brain } from 'lucide-react';
import MDPage from '../components/MDPage';
import { useTranslation } from 'react-i18next';

const NCQLLMPlanPage = () => {
  const { t } = useTranslation();
  
  return (
    <MDPage
      filePath="03-NCQ-LLM-PLAN.md"
      title={t('md_pages.ncq_llm_plan')}
      description={t('md_pages.ncq_llm_plan_desc')}
      icon={Brain}
    />
  );
};

export default NCQLLMPlanPage;