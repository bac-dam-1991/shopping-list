import serverless from '@vendia/serverless-express';
import app from './app';

export const handler = async (event: any, context: any, callback: any) => {
	// Strip off the lambda name part of the path
	const slashIndex = event.path.indexOf('/', 1);
	event.path = event.path.substring(slashIndex);

	// Create a serverless instance
	const serverlessInstance = serverless({ app });
	return serverlessInstance(event, context, callback);
};
