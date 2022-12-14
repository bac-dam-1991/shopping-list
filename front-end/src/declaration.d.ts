declare global {
	interface Window {
		__appConfig__: {
			apiEndpoint: string;
			auth0Domain: string;
			auth0ClientId: string;
			auth0Audience: string;
		};
	}
}

export {};
