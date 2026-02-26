import User from './schema.js';

class UserRepository {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email, includePassword = false) {
    try {
      let query = User.findOne({ email, isActive: true });
      
      if (includePassword) {
        query = query.select('+password');
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  async updateLastLogin(id) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  async updatePreferences(id, preferences) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { preferences },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }

  async deactivateAccount(id) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).exec();
    } catch (error) {
      throw error;
    }
  }
}

const userRepo = new UserRepository();
export default userRepo