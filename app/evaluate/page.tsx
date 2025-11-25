'use client';

import { useState } from 'react';
import UnifiedEvaluationForm from '@/components/evaluation/UnifiedEvaluationForm';
import EvaluationResults from '@/components/evaluation/EvaluationResults';

export default function EvaluatePage() {
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  const handleResults = (data: any, form: any) => {
    setResults(data);
    setFormData(form);
  };

  const handleBack = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      {!results ? (
        <UnifiedEvaluationForm onResults={handleResults} onBack={() => window.history.back()} />
      ) : (
        <EvaluationResults results={results} formData={formData} onReset={handleBack} />
      )}
    </div>
  );
}
