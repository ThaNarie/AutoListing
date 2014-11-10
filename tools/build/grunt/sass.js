module.exports = function (grunt, options)
{
	return {
		default: {
			options: {
				cacheLocation: '<%= gruntDir %>/.sass-cache',
				sourcemap: true,
				style: 'compressed'
			},
			files: [{
		        expand: true,
		        cwd: '<%= sourceDir %>inc/style',
		        src: ['*.scss'],
		        dest: '<%= sourceDir %>inc/style',
		        ext: '.css'
	        }]
		}
	};
};