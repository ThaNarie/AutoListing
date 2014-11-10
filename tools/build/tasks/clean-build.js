var fs = require('fs-extra');
var lineReader = require('line-reader');
var walk = require('walk');


module.exports = function (grunt)
{
	grunt.registerMultiTask(
		'clean-build',
		'clean build dir from minified and source files',
		function ()
	{
		var done = this.async();


		var buildDir = grunt.config('clean-build.' + this.target + '.buildDir');
		var excludeList = grunt.config('clean-build.options.exclude');
		var removeList = grunt.config('clean-build.options.remove');

		var type = 'module';
		var modules = {};
		var currentModule;

//				console.log('modules: ', modules);

		var checkRemove = function(result)
		{
			for (var j = 0; j < removeList.length; j++)
			{
				var removeItem = removeList[j];
				var match = removeItem.replace('*', '');

				var starPos = removeItem.indexOf('*');

				// complete match
				if (starPos == -1 && result == removeItem)
				{
					return true;
				}
				// match end
				else if (starPos == 0 && result.indexOf(match) == result.length - (match.length))
				{
					return true;
				}
				// match anywhere
				else if (starPos == removeItem.length - 1 && result.indexOf(match) != -1)
				{
					return true;
				}
			}

			return false;
		};

		getFiles(buildDir + '/', function(results)
		{
			for (var i = 0; i < results.length; ++i)
			{
				var result = results[i];

				if (excludeList.indexOf(result) != -1)
				{
					results.splice(i, 1);
					--i;
					continue;
				}

				if (checkRemove(result))
				{
					console.log('remove : ' + buildDir + result);
					fs.unlinkSync(buildDir + result)
					results.splice(i, 1);
					--i;
					continue;
				}

				switch (result.split('.').pop().toLowerCase())
				{
					case 'js':
					{
						break;
					}

					default:
					{
						// leave
						results.splice(i, 1);
						--i;
						break;
					}
				}
			}

			console.log('');
			console.log('unused files:');
			console.log(results);

//					console.log('removing unused files: ');
//
//					for (var i = 0; i < results.length; ++i)
//					{
//						console.log('- :', results[i]);
//						fs.unlinkSync(results[i]);
//					}

//					console.log('generated modules: ');
//					for (var module in  modules)
//					{
//						console.log('- :', module);
//					}

			removeEmptyDirs(buildDir + '/');

			done();
		});
	});

	function deleteFolderRecursive(path)
	{
		if (fs.existsSync(path))
		{
			fs.readdirSync(path).forEach(function (file, index)
			{
				var curPath = path + "/" + file;
				if (fs.statSync(curPath).isDirectory())
				{
					deleteFolderRecursive(curPath);
				}
				else
				{ // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}

	function getFiles(dir, cb)
	{
		walker = walk.walk(dir.split('').pop() == '/' ? dir.substr(0, dir.length - 1) : dir, {
			followLinks: false
			// directories with these keys will be skipped
			, filters: ["Temp", "_Temp"]
		});

		var files = [];

		walker.on("file", function (root, fileStats, next)
		{
			var name = root + '/' + fileStats.name;
			files.push(name.replace(dir, ''));
			next();
		});

		walker.on("errors", function (root, nodeStatsArray, next)
		{
			next();
		});

		walker.on("end", function ()
		{
			cb(files);
		});
	}

	function removeEmptyDirs(dir)
	{
		var list = fs.readdirSync(dir);

		if (list && list.length > 0)
		{
			for (var i = 0; i < list.length; ++i)
			{
				var file = dir + list[i];

				var stat = fs.statSync(file);

				if (stat && stat.isDirectory())
				{
					if (removeEmptyDirs(file + '/'))
					{
						fs.rmdirSync(file);
						list.splice(i, 1);
						--i;
					}
				}
			}
		}

		if (!list || list.length == 0)
		{
			return true;
		}
	}
}