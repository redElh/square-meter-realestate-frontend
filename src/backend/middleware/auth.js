const { verifyAccessToken } = require('../utils/jwt');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const result = await pool.query('SELECT id, email, role, first_name, last_name FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = { authenticate };
