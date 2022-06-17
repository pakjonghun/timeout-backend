import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { resolve } from 'path';
import router from './routes';
import nunjucks from 'nunjucks';
import { createServer } from 'http';
import handleSocket from './socket';
import connect from './schemas';

config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(resolve(__dirname, 'public')));
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//   }),
// );
app.use('/', router);
connect();

const server = createServer(app);
handleSocket(server);

server.listen(process.env.PORT, () => {
  console.log('server is running', process.env.PORT);
});
