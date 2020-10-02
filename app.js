const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const path = require('path');
const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/appError');

const globalErrorHandler = require('./controllers/errorController');
const programRouter = require('./routes/programRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const sectionRouter = require('./routes/sectionRoutes');
const activityRouter = require('./routes/activityRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// MIDDLEWARES

//Implement CORS
app.use(cors());
app.options('*', cors());

//Serving static files.
app.use(express.static(path.join(__dirname, 'public')));

//Set security http header.
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'https://*.cloudflare.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      upgradeInsecureRequests: [],
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests that have come from this IP, Please try again later.',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL Query Injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(
  hpp({
    whitelist: ['ratingsQuantity', 'ratingsAverage'],
  })
);

app.use(compression());

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/programs', programRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/sections', sectionRouter);
app.use('/api/v1/activities', activityRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} path.`, 404));
});

//Middleware to send json responses instead of HTML when an error occurs.
app.use(globalErrorHandler);

module.exports = app;
