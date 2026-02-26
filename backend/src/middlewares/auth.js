import tokenService from './token.js';
import userRepository from '../features/User/repo.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user from database
    const user = await userRepository.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Attach user to request
    req.user = {
      userId: user._id,
      email: user.email,
      preferences: user.preferences
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;