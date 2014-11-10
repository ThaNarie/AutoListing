module.exports = function (grunt)
{
	require('time-grunt')(grunt);
	
	var path = require('path');


	var sourceDir = 'source/';
	var buildDir = 'build/';
	var gruntDir = process.cwd();

	require('load-grunt-config')(grunt, {

		//auto grunt.initConfig
		init: true,

		//data passed into config.  Can use with <%= test %>
		data: {
			sourceDir: sourceDir,
			buildDir: buildDir,
			gruntDir: gruntDir
		},

		// auto-loads tasks when needed, instead of by default
		jitGrunt: {
			// here you can pass options to jit-grunt (or just jitGrunt: true)
			customTasksDir: 'tasks'

		}
	});

	// change base so tasks don't have to '../'
	grunt.file.setBase('../../');
};