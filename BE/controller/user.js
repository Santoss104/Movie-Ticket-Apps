const validator = require("email-validator");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const tokenizer = require("./tokenizer");
const fs = require("fs");
const path = require("path");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required.", success: false });
  }

  if (!validator.validate(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format.", success: false });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long.",
      success: false,
    });
  }

  try {
    const userDoc = await db.collection("users").doc(email).get();

    if (userDoc.exists) {
      return res.status(500).json({
        message: "User exist. Please login with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db
      .collection("users")
      .doc(email)
      .set({
        userId,
        name,
        email,
        password: hashedPassword,
        avatarUrl:
          "https://api.dicebear.com/9.x/thumbs/png?seed=" +
          (name || userId).split(" ").join("_"),
      });

    res
      .status(201)
      .json({ message: "User registered successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required.", success: false });
  }

  try {
    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        message: "Login failed. Please check your email or password!",
        success: false,
      });
    }

    const user = userDoc.data();

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Login failed. Please check your email or password!",
        success: false,
      });
    }

    const accessToken = tokenizer.generateAccessToken({ email: user.email });
    const refreshToken = await tokenizer.generateRefreshToken({
      email: user.email,
    });

    res
      .status(200)
      .json({ userId: user.userId, accessToken, refreshToken, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userDoc = await db.collection("users").doc(userEmail).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    const user = userDoc.data();

    res.status(200).json({
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      phone: user.phone || "",
      gender: user.gender || "",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender } = req.body;
    const avatar = req.file;

    const userEmail = req.user.email;
    const userDoc = await db.collection("users").doc(userEmail).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    const updates = {};

    const avatarUrlNow = userDoc.get("avatarUrl");

    if (name) updates.name = name;
    if (gender) updates.gender = gender;
    if (phone) updates.phone = phone;

    if (avatar) {
      const folderPath = path.join(__dirname, "..", "public", "avatars");
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const fileName = `${Date.now()}-${avatar.originalname
        .split(" ")
        .join("_")}`;
      const filePath = path.join(folderPath, fileName);

      fs.writeFile(filePath, avatar.buffer, async (err) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res
            .status(500)
            .json({ error: "File upload failed", success: false });
        }

        updates.avatarUrl = `${process.env.BASE_URL}/avatars/${fileName}`;

        await db.collection("users").doc(userEmail).update(updates);

        return res.status(200).json({
          message: "Successfully update profile!",
          avatarUrl: updates.avatarUrl,
          success: true,
        });
      });
    } else {
      await db.collection("users").doc(userEmail).update(updates);

      return res.status(200).json({
        message: "Successfully update profile!",
        avatarUrl: avatarUrlNow,
        success: true,
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    const userEmail = req.user.email;

    await db.collection("refreshTokens").doc(userEmail).delete();

    res.status(200).json({ message: "Logout successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
};
 