const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MySQL Database Configuration


// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing. Please log in to access this resource.",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }
    req.user = user;
    next();
  });
};

// Generate Access and Refresh Tokens
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "30m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "90d" });
};

// Save Refresh Token in MySQL
const saveRefreshToken = async (userId, token) => {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 90);

  const query = `
    INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      refresh_token = VALUES(refresh_token),
      expires_at = VALUES(expires_at);
  `;
  await db.query(query, [userId, token, expiration]);
};

// Register a New User
const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashPassword,
    ]);

    const newUserId = result.insertId;
    const accessToken = generateAccessToken({ user: username });
    const refreshToken = generateRefreshToken({ user: username });

    await saveRefreshToken(newUserId, refreshToken);

    res.json({
      user: { id: newUserId, username },
      message: "Registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};

// Log In an Existing User
const logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const [tokens] = await db.query("SELECT * FROM refresh_tokens WHERE user_id = ?", [user.id]);

    if (tokens.length === 0) {
      return res.status(400).json({ error: "No refresh token found, please register first" });
    }

    const refreshTokenData = tokens[0];
    jwt.verify(refreshTokenData.refresh_token, process.env.REFRESH_SECRET, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken({ user: user.username });
      const newRefreshToken = generateRefreshToken({ user: user.username });

      await saveRefreshToken(user.id, newRefreshToken);

      res.setHeader("Authorization", `Bearer ${accessToken}`);
      res.setHeader("Refresh-Token", newRefreshToken);

      res.json({
        success: "User logged in successfully",
        user: { id: user.id, username: user.username },
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};

// Log Out a User
const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    await db.query("DELETE FROM refresh_tokens WHERE user_id = ?", [decoded.user_id]);

    res.json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};

module.exports = { logIn, register, authenticateToken, logout };
