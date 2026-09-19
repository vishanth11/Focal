const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true, lowercase: true, unique: true },
    registrationNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    website: { type: String, required: true, trim: true },
    linkedinUrl: { type: String, trim: true },
    walletAddress: { type: String, required: true, trim: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'revoked'],
      default: 'pending',
      index: true
    },
    verificationDate: Date,
    revocationDate: Date,
    rejectionReason: String,
    revocationReason: String,
    tokenId: Number,
    tokenURI: String,
    verificationHash: String,
    mintTransactionHash: String,
    revokeTransactionHash: String,
    verificationReport: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

companySchema.index({ name: 'text', domain: 'text' });

module.exports = mongoose.model('Company', companySchema);
