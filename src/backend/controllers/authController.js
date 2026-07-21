const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendPasswordResetEmail } = require('../utils/email');
const pool = require('../config/database');

const handleOAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log('OAuth success for:', user.email);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard/${user.role}/${user.id}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists. Please go to login.' });
    }

    const fullnameExists = await pool.query(
      'SELECT id FROM users WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)',
      [firstName, lastName]
    );
    if (fullnameExists.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this fullname already exists. Please go to login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, original_role, linked_spaces, first_name, last_name, provider, provider_id, is_verified)
       VALUES ($1, $2, $3, $3, $4::jsonb, $5, $6, NULL, NULL, true) RETURNING id, email, role, first_name, last_name, original_role, linked_spaces`,
      [email, password_hash, role, JSON.stringify([role]), firstName, lastName]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'Account created successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let result;
    try {
      result = await pool.query(
        'SELECT id, email, role, first_name, last_name, password_hash, provider, original_role, linked_spaces FROM users WHERE email = $1',
        [email]
      );
    } catch {
      result = await pool.query(
        'SELECT id, email, role, first_name, last_name, password_hash, provider FROM users WHERE email = $1',
        [email]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email. Please create an account.' });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      const providerName = user.provider || 'social';
      return res.status(400).json({ error: `This account uses ${providerName} sign-in. Please sign in with ${providerName}.` });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash, ...safeUser } = user;
    res.json({ message: 'Login successful', user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    const user = result.rows[0];
    const { generateAccessToken } = require('../utils/jwt');
    const resetToken = generateAccessToken(user.id);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [resetToken, expiresAt, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const { verifyAccessToken } = require('../utils/jwt');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired reset token.' });
    }

    const result = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expires > NOW()',
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [password_hash, decoded.userId]
    );

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) return res.status(401).json({ error: 'Invalid refresh token' });

    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND refresh_token = $2', [decoded.userId, refreshToken]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(decoded.userId);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      const { verifyAccessToken } = require('../utils/jwt');
      const decoded = verifyAccessToken(token);
      if (decoded) {
        await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [decoded.userId]);
      }
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

module.exports = { handleOAuthCallback, register, login, forgotPassword, resetPassword, refreshAccessToken, logout, getCurrentUser };
