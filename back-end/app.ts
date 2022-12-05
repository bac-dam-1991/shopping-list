import express from 'express';
import cors from 'cors';
import shoppingListsController from './src/controllers/shopping-lists';
import { errorHandler } from './src/middlewares/error-handler';
import { expressjwt as jwt, GetVerificationKey } from 'express-jwt';
import jwks from 'jwks-rsa';

const secret = jwks.expressJwtSecret({
	cache: true,
	rateLimit: true,
	jwksRequestsPerMinute: 5,
	jwksUri: process.env.AUTH0_JWKS_URI!,
}) as GetVerificationKey;

const jwtCheck = jwt({
	secret,
	audience: process.env.AUTH0_AUDIENCE!,
	issuer: process.env.AUTH0_ISSUER!,
	algorithms: ['RS256'],
});

const app = express();

app.use(cors());
app.use(jwtCheck);
app.use(express.json());
app.use('/api/v1/shopping-lists', shoppingListsController);
app.use(errorHandler);

export default app;
