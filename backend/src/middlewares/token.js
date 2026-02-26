import jwt from "jsonwebtoken";

class TokenService {
  generateTokens(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return { accessToken, refreshToken };
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

const tokenService = new TokenService();
export default tokenService;