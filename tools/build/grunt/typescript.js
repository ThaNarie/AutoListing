module.exports = function (grunt, options)
{
	return {
		options: {
			module: 'amd',
			target: 'es3',
			basePath: '../../<%= sourceDir %>inc/script',
			sourcemap: false,
			declaration: false,
			comments:true
		},
		default: {
			src: ['<%= sourceDir %>inc/script/**/*.ts']
		}
	};
};