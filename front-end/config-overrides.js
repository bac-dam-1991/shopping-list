const {
	aliasDangerous,
	configPaths,
} = require('react-app-rewire-alias/lib/aliasDangerous');

const aliasMap = configPaths('./tsconfig.paths.json');

module.exports = aliasDangerous(aliasMap);
