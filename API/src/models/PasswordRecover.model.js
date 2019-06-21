import mongoose from 'mongoose';

import { TOKENS } from '../config/constants';

const tokenSchema = new mongoose.Schema({
  token: String,
  userId: String,
}, { timestamps: true });

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: TOKENS.PASSWORD_EXPIRE });

export default mongoose.model('PasswordRecovery', tokenSchema);
