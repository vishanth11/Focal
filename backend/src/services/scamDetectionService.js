const axios = require('axios');
const env = require('../config/env');

function detectInputType(input = '') {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) {
    return 'url';
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@')) {
    return 'email';
  }
  return 'company_name';
}

function fallbackAnalysis(input, inputType) {
  const lower = input.toLowerCase();
  const redFlags = [];

  if (lower.includes('registration fee') || lower.includes('pay') || lower.includes('urgent')) {
    redFlags.push('Contains payment pressure or urgency language');
  }
  if (lower.includes('whatsapp') || lower.includes('telegram')) {
    redFlags.push('Pushes communication to informal channels');
  }
  if (inputType === 'url' && !/^https:\/\//i.test(input)) {
    redFlags.push('Website is not HTTPS');
  }
  if (/\.(xyz|top|click|work)(\/|$)/i.test(input)) {
    redFlags.push('Uses a commonly abused low-trust domain extension');
  }

  return {
    riskScore: Math.min(95, redFlags.length * 25 + (inputType === 'email' ? 10 : 0)),
    redFlags,
    confidence: 0.55,
    source: 'local_fallback'
  };
}

async function callMLAPI(input, inputType) {
  try {
    const response = await axios.post(
      env.mlApiUrl,
      { input, inputType },
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    return fallbackAnalysis(input, inputType);
  }
}

async function analyzeOpportunity(input) {
  const inputType = detectInputType(input);
  const mlResult = await callMLAPI(input, inputType);

  return {
    riskScore: Number(mlResult.riskScore || 0),
    redFlags: Array.isArray(mlResult.redFlags) ? mlResult.redFlags : [],
    confidence: Number(mlResult.confidence || 0),
    inputType
  };
}

module.exports = {
  analyzeOpportunity,
  callMLAPI,
  detectInputType
};
