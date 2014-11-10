/**
 * Merges all knockout templates in the index.php
 */
module.exports = function (grunt, options)
{
	return {
		options: {},
		default: {
			index: '<%= buildDir %>index.php',
			files: '<%= buildDir %>inc/template/*.html'
		}
	};
};