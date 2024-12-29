const jwt = require("jsonwebtoken");
const db = require("../config/db");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  const docRef = db.collection("refreshTokens").doc(user.email);
  await docRef.set({ refreshToken });

  return refreshToken;
};

const authenticateToken = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }
  if (!token.includes("Bearer")) {
    return res
      .status(400)
      .json({ message: "Authorization with 'Bearer token' required!" });
  }
  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid token. Please login first." });
  }
};

const refreshAccessToken = async (req, res) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Authorization required!" });
  }
  if (!token.includes("Bearer")) {
    return res
      .status(400)
      .json({ message: "Authorization with 'Bearer token' required!" });
  }
  token = token.split(" ")[1];

  const tokensRef = db.collection("refreshTokens");
  const query = await tokensRef.where("refreshToken", "==", token).get();

  if (query.empty)
    return res.status(403).json({ message: "Invalid Refresh Token!" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Refresh Token" });

    const accessToken = generateAccessToken({ email: user.email });
    res.json({ accessToken });
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  refreshAccessToken,
};
