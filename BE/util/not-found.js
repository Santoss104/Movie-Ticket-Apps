const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: "Route Not Found" });
};

module.exports = notFoundHandler;
