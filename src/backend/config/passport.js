const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require('./database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
          const user = existingUser.rows[0];
          await pool.query(
            'UPDATE users SET provider = $1, provider_id = $2, refresh_token = $3 WHERE id = $4',
            ['google', profile.id, refreshToken, user.id]
          );
          return done(null, user);
        }

        const newUser = await pool.query(
          `INSERT INTO users (email, provider, provider_id, is_verified, role, first_name, last_name, refresh_token) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            email,
            'google',
            profile.id,
            true,
            'user',
            profile.name?.givenName || null,
            profile.name?.familyName || null,
            refreshToken
          ]
        );

        done(null, newUser.rows[0]);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('Email not provided by Facebook'), null);
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
          const user = existingUser.rows[0];
          await pool.query(
            'UPDATE users SET provider = $1, provider_id = $2, refresh_token = $3 WHERE id = $4',
            ['facebook', profile.id, refreshToken, user.id]
          );
          return done(null, user);
        }

        const newUser = await pool.query(
          `INSERT INTO users (email, provider, provider_id, is_verified, role, first_name, last_name, refresh_token) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [
            email,
            'facebook',
            profile.id,
            true,
            'user',
            profile.name?.givenName || null,
            profile.name?.familyName || null,
            refreshToken
          ]
        );

        done(null, newUser.rows[0]);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
