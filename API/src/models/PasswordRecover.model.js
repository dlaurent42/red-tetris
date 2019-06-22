import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: String,
  userId: String,
  createdAt: {
    type: Date,
    expires: '1d',
    default: Date.now,
  },
});


export default mongoose.model('PasswordRecovery', tokenSchema);
