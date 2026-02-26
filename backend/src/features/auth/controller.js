import userRepository from '../User/repo.js';
import tokenService from '../../middlewares/token.js';
import { validationResult } from 'express-validator';

class AuthController {
  async register(req, res, next) {
    console.log("newwwww");
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create new user
      const user = await userRepository.create({
        email,
        password,
        name
      });

      // Generate tokens
      const tokens = tokenService.generateTokens(user);

      res.status(201).json({
        message: 'User created successfully',
        user,
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user with password
      const user = await userRepository.findByEmail(email, true);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      await userRepository.updateLastLogin(user._id);

      // Generate tokens
      const tokens = tokenService.generateTokens(user);

      res.json({
        message: 'Login successful',
        user: user.toJSON(),
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }

      // Verify refresh token
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Find user
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Generate new tokens
      const tokens = tokenService.generateTokens(user);

      res.json({
        message: 'Token refreshed successfully',
        ...tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, just return success
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();
export default authController;