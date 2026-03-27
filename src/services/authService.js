import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

class AuthService {
  // Generate JWT token
  generateToken(adminId) {
    return jwt.sign(
      { id: adminId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Decode JWT token without verification
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  // Get token expiry
  getTokenExpiry(token) {
    const decoded = this.decodeToken(token);
    return decoded ? new Date(decoded.exp * 1000) : null;
  }

  // Check if token is expired
  isTokenExpired(token) {
    const expiry = this.getTokenExpiry(token);
    return expiry ? expiry < new Date() : true;
  }

  // Get token remaining time in seconds
  getTokenRemainingTime(token) {
    const expiry = this.getTokenExpiry(token);
    if (!expiry) return 0;
    const remaining = (expiry - new Date()) / 1000;
    return remaining > 0 ? remaining : 0;
  }

  // Create refresh token (for future use)
  generateRefreshToken(adminId) {
    return jwt.sign(
      { id: adminId, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'refresh') {
        return null;
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Validate admin credentials
  async validateCredentials(email, password) {
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    if (!admin) {
      return { valid: false, reason: 'Admin not found' };
    }

    if (!admin.isActive) {
      return { valid: false, reason: 'Account is deactivated' };
    }

    if (admin.isLocked()) {
      return { valid: false, reason: 'Account is locked' };
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      await admin.incLoginAttempts();
      return { valid: false, reason: 'Invalid password' };
    }

    await admin.resetLoginAttempts();
    return { valid: true, admin };
  }
}

export default new AuthService();