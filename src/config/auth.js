import 'dotenv/config';

export default {
  secret: process.env.APP_ENV,
  expiresIn: '7d',
};
