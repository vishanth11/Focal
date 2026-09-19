const crypto = require('crypto');

function normalizeDomain(value = '') {
  return value
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .trim()
    .toLowerCase();
}

function buildTokenURI(company, verificationHash, status = 'verified') {
  const metadata = {
    name: `OMEN Verified Badge - ${company.name}`,
    description: `Soulbound verification badge for ${company.name}`,
    external_url: company.website,
    attributes: [
      { trait_type: 'Company Domain', value: company.domain },
      { trait_type: 'Verification Status', value: status },
      { trait_type: 'Verification Hash', value: verificationHash }
    ]
  };

  return `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`;
}

function hashObject(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = {
  asyncHandler,
  buildTokenURI,
  hashObject,
  normalizeDomain
};
