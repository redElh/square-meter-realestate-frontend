const express = require('express');
const passport = require('../config/passport');
const { handleOAuthCallback, register, login, forgotPassword, resetPassword, refreshAccessToken, logout, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth` }), handleOAuthCallback);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/auth` }), handleOAuthCallback);

// Local auth
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Token refresh
router.post('/refresh', refreshAccessToken);

// Logout
router.post('/logout', logout);

// Check auth status
router.get('/check', async (req, res) => {
  try {
    console.log('🔍 /auth/check called');
    console.log('Cookies:', req.cookies);
    
    const token = req.cookies.accessToken;
    if (!token) {
      console.log('❌ No access token found');
      return res.json({ authenticated: false });
    }

    const { verifyAccessToken } = require('../utils/jwt');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      console.log('❌ Token verification failed');
      return res.json({ authenticated: false });
    }

    const pool = require('../config/database');
    let result;
    try {
      result = await pool.query(
        'SELECT id, email, role, first_name, last_name, original_role, linked_spaces FROM users WHERE id = $1',
        [decoded.userId]
      );
    } catch {
      // Fallback if columns don't exist yet (pre-migration)
      result = await pool.query(
        'SELECT id, email, role, first_name, last_name FROM users WHERE id = $1',
        [decoded.userId]
      );
      // Add default values for missing columns
      result.rows[0].original_role = null;
      result.rows[0].linked_spaces = [];
    }

    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      return res.json({ authenticated: false });
    }
    
    console.log('✅ User authenticated:', result.rows[0].email);
    res.json({ authenticated: true, user: result.rows[0] });
  } catch (error) {
    console.error('❌ /auth/check error:', error);
    res.json({ authenticated: false });
  }
});

// Select role (first-time or adding a new space)
router.post('/select-role', authenticate, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'seller', 'owner', 'lessor', 'tenant', 'traveler'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const pool = require('../config/database');

    // Get current user data
    let user;
    try {
      const userResult = await pool.query(
        'SELECT role, original_role, linked_spaces FROM users WHERE id = $1',
        [req.user.id]
      );
      user = userResult.rows[0];
    } catch {
      const userResult = await pool.query(
        'SELECT role FROM users WHERE id = $1',
        [req.user.id]
      );
      user = { ...userResult.rows[0], original_role: null, linked_spaces: [] };
    }

    // If this is the first role selection (OAuth user with role='user'), set original_role and linked_spaces
    if (user.role === 'user') {
      const linked = user.linked_spaces || [];
      if (!linked.includes(role)) {
        linked.push(role);
      }
      await pool.query(
        'UPDATE users SET role = $1, original_role = $1, linked_spaces = $2::jsonb WHERE id = $3',
        [role, JSON.stringify(linked), req.user.id]
      );
    } else {
      // Adding a new space to existing user
      const linked = user.linked_spaces || [];
      if (!linked.includes(role)) {
        linked.push(role);
      }
      await pool.query(
        'UPDATE users SET linked_spaces = $1::jsonb WHERE id = $2',
        [JSON.stringify(linked), req.user.id]
      );
    }

    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('select-role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Add a new linked space
router.post('/add-space', authenticate, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'seller', 'owner', 'lessor', 'tenant', 'traveler'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const pool = require('../config/database');
    let userRow;
    try {
      const result = await pool.query(
        'SELECT linked_spaces, original_role FROM users WHERE id = $1',
        [req.user.id]
      );
      userRow = result.rows[0];
    } catch {
      userRow = { linked_spaces: [], original_role: null };
    }
    const linked = userRow.linked_spaces || [];
    if (linked.includes(role)) {
      return res.status(409).json({ error: 'Space already exists' });
    }
    linked.push(role);
    const updated = await pool.query(
      'UPDATE users SET linked_spaces = $1::jsonb WHERE id = $2 RETURNING linked_spaces, original_role',
      [JSON.stringify(linked), req.user.id]
    );
    res.json({ linkedSpaces: updated.rows[0].linked_spaces, originalRole: updated.rows[0].original_role });
  } catch (error) {
    console.error('add-space error:', error);
    res.status(500).json({ error: 'Failed to add space' });
  }
});

// Remove a linked space (cannot remove original_role)
router.post('/remove-space', authenticate, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['buyer', 'seller', 'owner', 'lessor', 'tenant', 'traveler'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const pool = require('../config/database');
    let userRow;
    try {
      const result = await pool.query(
        'SELECT linked_spaces, original_role FROM users WHERE id = $1',
        [req.user.id]
      );
      userRow = result.rows[0];
    } catch {
      userRow = { linked_spaces: [], original_role: null };
    }
    const user = userRow;
    if (role === user.original_role) {
      return res.status(403).json({ error: 'Cannot remove your original space' });
    }
    const linked = (user.linked_spaces || []).filter((r) => r !== role);
    const updated = await pool.query(
      'UPDATE users SET linked_spaces = $1::jsonb WHERE id = $2 RETURNING linked_spaces, original_role',
      [JSON.stringify(linked), req.user.id]
    );
    res.json({ linkedSpaces: updated.rows[0].linked_spaces, originalRole: updated.rows[0].original_role });
  } catch (error) {
    console.error('remove-space error:', error);
    res.status(500).json({ error: 'Failed to remove space' });
  }
});

module.exports = router;
