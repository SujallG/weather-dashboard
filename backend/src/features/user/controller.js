import userRepository from './repo.js';
import cityRepository from '../weatherService/repo.js';

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const { temperatureUnit, theme } = req.body;
      
      const user = await userRepository.updatePreferences(req.user.userId, {
        temperatureUnit,
        theme
      });

      res.json({
        message: 'Preferences updated successfully',
        preferences: user.preferences
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardData(req, res, next) {
    try {
      const cities = await cityRepository.findByUserId(req.user.userId);
      
      res.json({
        user: req.user,
        cities,
        preferences: req.user.preferences
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateAccount(req, res, next) {
    try {
      await userRepository.deactivateAccount(req.user.userId);
      
      res.json({ message: 'Account deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;