import { useNavigate } from 'react-router-dom';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { ReactNode } from 'react';

export interface Auth0ProviderWithHistoryProps {
	children: ReactNode;
}

const domain = window.__appConfig__.auth0Domain;
const clientId = window.__appConfig__.auth0ClientId;
const audience = window.__appConfig__.auth0Audience!;

export const Auth0ProviderWithHistory = ({
	children,
}: Auth0ProviderWithHistoryProps) => {
	const navigate = useNavigate();

	const onRedirectCallback = (appState?: AppState) => {
		navigate(appState?.returnTo || window.location.pathname);
	};

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			redirectUri={window.location.origin}
			onRedirectCallback={onRedirectCallback}
			audience={audience}
		>
			{children}
		</Auth0Provider>
	);
};
