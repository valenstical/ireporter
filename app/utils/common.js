import jwt from 'jsonwebtoken';

const Common = {

  success: (res, code, data) => {
    res.status(code).json({ status: code, data });
  },

  error: (res, code, message) => {
    res.status(code).json({ status: code, error: message });
  },

  createToken: (value, done) => {
    jwt.sign({ userId: value }, process.env.SECRET, { expiresIn: '7d' }, (err, token) => {
      done(token);
    });
  },

  verifyToken: (token, done) => {
    jwt.verify(token, process.env.SECRET, done);
  },

  sleep: (seconds) => {
    const time = new Date(new Date().getTime() + (seconds * 1000));
    while (time > new Date()) { /* TODO */ }
  },
};

export default Common;
