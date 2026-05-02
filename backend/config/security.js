// Security configuration settings
const securityConfig = {
  // Password validation rules
  passwordRules: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChar: true
  },

  // CORS configuration
  corsOptions: {
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // JWT configuration
  jwtOptions: {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    algorithm: 'HS256'
  },

  // Session configuration
  sessionOptions: {
    secret: process.env.SESSION_SECRET || 'session-secret-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // Rate limiting configuration
  rateLimitOptions: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  }
};

module.exports = securityConfig;
