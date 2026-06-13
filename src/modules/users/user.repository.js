import { User } from './user.model.js';

export async function findUserByEmail(email) {
  return User.findOne({ email });
}

export async function findUserById(id) {
  return User.findById(id).select('-password');
}

export async function createUser(data) {
  return User.create(data);
}

export async function findAllUsers() {
  return User.find().select('-password');
}

export async function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
}

export async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}
