module.exports = function (grunt)
{
	grunt.registerTask('create-component', 'Create a component (template, viewmodel and controller).', function(n)
	{

		var name = grunt.option('name');

		if (typeof name == 'undefined' || name == '' || typeof name == 'boolean')
		{
			grunt.log.warn('Error: No component name given!');
			showHelp();

			return;
		}

		var componentDir = grunt.config('create-component.options.componentDir') + name + '/';
		var templateDir = grunt.config('create-component.options.templateDir');
		var scssDir = grunt.config('create-component.options.scssDir');
		var componentScssPath = grunt.config('create-component.options.componentScssPath');
		var scssComponentDir = grunt.config('create-component.options.scssComponentDir');

		if (grunt.file.exists(componentDir))
		{
			grunt.log.error('Component already exists! Won\'t overwrite. Choose a different name!');

			return;
		}


		var camelCaseName = camelCase(name);

		var templateVars = {
			name:           name,
			camelCaseName:  camelCaseName,
			viewModelName:  camelCaseName + 'ViewModel',
			controllerName: camelCaseName + 'Controller',
			optionsName: 	camelCaseName + 'Options',
			scssName: 	    name,
			template:       name + '.html'
		};

		writeTemplate(templateDir + 'controller.txt', componentDir + templateVars.controllerName + '.ts', templateVars);
		writeTemplate(templateDir + 'viewmodel.txt',  componentDir + templateVars.viewModelName + '.ts', templateVars);
		writeTemplate(templateDir + 'options.txt',    componentDir + templateVars.optionsName + '.ts', templateVars);
		writeTemplate(templateDir + 'template.txt',   componentDir + templateVars.template, templateVars);
		writeTemplate(templateDir + 'scss.txt',       scssDir + scssComponentDir + templateVars.scssName+ '.scss', templateVars);

		updateScreenSCSS(scssDir + componentScssPath, templateVars.scssName);

		grunt.log.subhead('Component creation succesful!');
		grunt.log.writeln('To use your component, open a view template and type the following:');
		grunt.log.writeln('<!--ko component: \'' + templateVars.name + '\'--><!--/ko-->');
	});

	function showHelp()
	{
		grunt.log.subhead('Usage: grunt create-component --name uber-component');
		grunt.log.write('This will create the component with the given name. Dashed names are transformed to camelCase ' +
			'filenames (e.g. uber-component will be UberComponentController, etc).');
	}

	function updateScreenSCSS(componentScssPath, newFilePath)
	{
		var screen = grunt.file.read(componentScssPath).split("\n");

		screen.push('@import "' + newFilePath + '";')

		grunt.file.write(componentScssPath, screen.join("\n"));
	}

	function writeTemplate(inFile, outFile, vars)
	{
		var file = grunt.file.read(inFile);

		file = file.replace(/\{([a-zA-Z]+)\}/ig, function (matched, key)
		{
			if (typeof vars[key] != 'undefined')
			{
				return vars[key];
			}
			else
			{
				grunt.log.warn('writeTemplate error: cannot replace ' + matched);
			}
		});

		grunt.file.write(outFile, file);
	}

	function camelCase(string)
	{
		return string.replace(/(^[a-z]|\-[a-z])/g, function (x)
		{
			return x.replace(/-/, '').toUpperCase()
		});
	}
};