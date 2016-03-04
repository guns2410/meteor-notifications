Package.describe({
	name: 'gunjansoni:notifications',
	version: '0.1.8',
	summary: 'Exchange Notification Messages between Server and Clients via DDP Connection',
	git: 'https://github.com/guns2410/meteor-notifications',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2.1');
	api.use(['ecmascript', 'mongo', 'underscore', 'jsx@0.2.3', 'gunjansoni:ddpconnector@0.0.1']);
	api.addFiles('notifications-client.jsx');
	api.addFiles('notifications-server.jsx', 'server');
	api.export(['ClientNotifications', 'ServerNotifications']);
});

Package.onTest(function(api) {
	api.use('ecmascript');
	api.use('tinytest');
	api.use('gunjansoni:notifications');
	api.addFiles('notifications-tests.js');
});
