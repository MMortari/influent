import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(routes);

const port = '3333';

app.listen(port, () => console.log(`Server started - ${port}`));
