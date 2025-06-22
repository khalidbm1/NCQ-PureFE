import React from 'react';
import { motion } from 'framer-motion';
import { Settings, RefreshCw, Download, Upload } from 'lucide-react';
import { useFinancial } from '../contexts/FinancialContext';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { resetData } = useFinancial();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <Settings size={32} className="text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('settings.data_settings')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {t('settings.export_description')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('settings.reset_data')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.reset_description')}
          </p>
          <button
            onClick={() => {
              if (confirm(t('settings.reset_confirm'))) {
                resetData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <RefreshCw size={16} />
            {t('settings.reset_to_defaults')}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('settings.export_import')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.export_description')}
          </p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              <Download size={16} />
              {t('common.export')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Upload size={16} />
              {t('common.import')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;