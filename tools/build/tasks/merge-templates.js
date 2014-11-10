module.exports = function (grunt) {
	// custom task
	grunt.registerMultiTask('merge-templates', 'Merges the templates in the index.php.', function () {
		var fileList = grunt.file.expand(grunt.config('merge-templates.default.files'));

		var index = grunt.file.read(grunt.config('merge-templates.default.index'));

		index = index.replace(/<!-- templates -->([\w\W]*)<!-- \/templates -->/gm, '');

		var templates = '\t<!-- templates -->\n';

		fileList.forEach(function (filepath) {
			grunt.log.writeln('Merging  "' + filepath + '"...');

			var template = grunt.file.read(filepath);

			templates += '\n<script type="text/html" id="' + /.*\/(.*?).html/gm.exec(filepath)[1] + '">\n\t' + template.split('\n').join('\n\t') + '\n</script>\n';
		});

		templates += '\n<!-- /templates -->\n';

		templates = templates.split('\n').join('\n\t');

		index = index.replace('</body>', templates + '\n</body>');

		grunt.log.writeln('Writing index...');
		grunt.file.write(grunt.config('merge-templates.default.index'), index);
	});
}