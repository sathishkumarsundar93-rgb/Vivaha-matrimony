const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  gender:     { type: String, enum: ['Male', 'Female'], required: true },
  age:        { type: Number, required: true },
  religion:   { type: String, required: true },
  city:       { type: String, required: true },
  profession: { type: String, required: true },
  height:     String,
  education:  String,
  about:      String,
  profilePic: { type: String, default: 'https://randomuser.me/api/portraits/men/1.jpg' },
  lookingFor: { type: String, enum: ['Male', 'Female', 'Any'], default: 'Any' },
  createdAt:  { type: Date, default: Date.now }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
