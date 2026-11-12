module.exports = (error, req, res, next) => {
  if (error.name === 'ZodError')
    return res
      .status(400)
      .json({ error: { message: 'Please check the goal fields', details: error.flatten() } });
  const status = error.status || 500;
  if (status >= 500) console.error('API error:', error.code || error.message);
  res.status(status).json({
    error: {
      message: status >= 500 ? 'Unable to access goals. Please try again later.' : error.message,
    },
  });
};
