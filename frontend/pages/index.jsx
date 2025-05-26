import React, { useState } from 'react';

export default function Home() {
  const [inputType, setInputType] = useState('url');
  const [inputValue, setInputValue] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
    setInputValue('');
    setAnalysisResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      // Call backend API for analysis (to be implemented)
      // For now, simulate response
      setTimeout(() => {
        setAnalysisResult({
          riskScore: Math.floor(Math.random() * 100),
          riskLevel: 'Suspeito',
          details: 'Análise simulada: conteúdo potencialmente fraudulento detectado.',
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      setAnalysisResult({ error: 'Erro ao analisar o conteúdo.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Analisador de Fraudes Online</h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="mr-4 font-semibold">Tipo de Entrada:</label>
          <select
            value={inputType}
            onChange={handleInputTypeChange}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="url">URL</option>
            <option value="text">Texto</option>
            <option value="image">Imagem (upload)</option>
          </select>
        </div>

        {inputType === 'url' && (
          <input
            type="text"
            placeholder="Digite a URL para análise"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
        )}

        {inputType === 'text' && (
          <textarea
            placeholder="Cole o texto para análise"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            rows={6}
          />
        )}

        {inputType === 'image' && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setInputValue(e.target.files[0]);
                  setAnalysisResult(null);
                }
              }}
              className="w-full"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analisando...' : 'Verificar'}
        </button>

        {analysisResult && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            {analysisResult.error ? (
              <p className="text-red-600">{analysisResult.error}</p>
            ) : (
              <>
                <p>
                  <strong>Pontuação de Risco:</strong> {analysisResult.riskScore}%
                </p>
                <p>
                  <strong>Nível de Risco:</strong> {analysisResult.riskLevel}
                </p>
                <p>{analysisResult.details}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
