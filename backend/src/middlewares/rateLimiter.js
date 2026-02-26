import rateLimit from 'express-rate-limit';

const general = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const auth = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 auth requests per hour
  skipSuccessfulRequests: true,
  message: {
    status: 429,
    message: 'Too many authentication attempts, please try again later.'
  }
});

const weather = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 weather requests per minute
  message: {
    status: 429,
    message: 'Weather API rate limit exceeded, please slow down.'
  }
});

export {
  general,
  auth,
  weather
};