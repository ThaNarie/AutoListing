/**
 * Cleans the build directory from combined javascript files (based on the build.txt outputted by r.js)
 */
module.exports = function (grunt, options)
{
	return {
		options: {
			// these files will be loaded via script-tags, so never remove them
			'exclude': [
				'inc/script/lib/modernizr.js',
				'inc/script/lib/require/require.js',
				'inc/script/app/config/requirejs.config.js',
				'inc/script/lib/require/text.js'
			],

			// besides the normal cleaning, also remove these file-patterns
			'remove': [
				'karma.conf.js',
				'inc/script/test/*',
				'*Definitions.js',
				'*.less',
				'*.scss',
				'*.scss.map',
				'*.ts',
				'*.js.map'
			]
		},
		default: {
			'buildDir': '<%= buildDir %>'
		}
	};
};