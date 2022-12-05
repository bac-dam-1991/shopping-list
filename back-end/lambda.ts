import serverless from '@vendia/serverless-express';
import app from './app';

export const handler = async (event: any, context: any, callback: any) => {
	// Create a serverless instance
	const serverlessInstance = serverless({ app });
	return serverlessInstance(event, context, callback);
};
