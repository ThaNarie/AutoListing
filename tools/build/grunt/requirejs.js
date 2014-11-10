module.exports = function (grunt, options)
{
	var modules = [
		{
			name: "app/Bootstrap",
			include: [
			]
		}
	];

	return {
		options: {
			appDir: '<%= sourceDir %>',
			mainConfigFile: '<%= sourceDir %>inc/script/app/Bootstrap.js',
			dir: '<%= buildDir %>',
			optimize: "none",
			fileExclusionRegExp: /(^\.svn|^\.git|^\.gitignore|^\.idea|.+?\.pem|.+?\.pub|.+?\.map|.+?\.map.+?|^.DS_STORE|.+?\.sh|^Thumbs.db)/,
			preserveLicenseComments: false,
			generateSourceMaps: false,
			modules: modules,
			removeCombined: true,

			uglify2: {
				compress: {
					global_defs: {
					}
				}
			}
		},

		release: {
			options: {
				uglify2: {
					compress: {
						global_defs: {
							RELEASE: true,
							DEBUG: false
						}
					}
				}
			}
		},

		debug: {
			options: {
				uglify2: {
					compress: {
						global_defs: {
							RELEASE: false,
							DEBUG: true
						}
					}
				}
			}
		}

	};
};