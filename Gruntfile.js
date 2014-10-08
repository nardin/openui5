/*
 * grunt-selenium-qunit
 *
 *
 * Copyright (c) 2014 SAP SE
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

	// Log time how long tasks take
	require('grunt-timer').init(grunt, {
		deferLogs: true,
		color: 'cyan'
	});

	// Load all custom tasks from grunt/tasks dir 
	grunt.loadTasks(path.join(process.cwd(), 'grunt/tasks'));

	// set default options
	grunt.option('production', grunt.option('production') || false);
	if (typeof grunt.option('minify-css') === 'undefined') {
		grunt.option('minify-css', grunt.option('production'));
	}
	if (typeof grunt.option('include-test-resources') === 'undefined') {
		grunt.option('include-test-resources', grunt.option('no-production'));
	}

	// set of libraries to use (e.g. --libs=sap.ui.core)
	var libsOption = grunt.option('libs');
	var libs = libsOption ? libsOption.split(',') : null;

	// the gruntdata contains the configuration for the build part
	// we distinguish here between a testsuite which is an application
	// and the libraries which are the re-use modules
	var gruntData = {
		testsuite: {
			name: 'testsuite',
			path: 'src/testsuite'
		},
		allLibraries: [
			{
					name: 'sap.ui.core',
					path: 'src/sap.ui.core',
					preload: {
						src : [
							'sap/ui/base/**/*.js',
							'sap/ui/model/**/*.js',
							'!sap/ui/core/cldr/**'
						]
					}
			},
			{
					name: 'sap.ui.unified',
					path: 'src/sap.ui.unified'
			},
			{
					name: 'sap.ui.layout',
					path: 'src/sap.ui.layout'
			},
			{
					name: 'sap.m',
					path: 'src/sap.m'
			},
			{
					name: 'sap.ui.commons',
					path: 'src/sap.ui.commons'
			},
			{
					name: 'sap.ui.table',
					path: 'src/sap.ui.table'
			},
			{
					name: 'sap.ui.ux3',
					path: 'src/sap.ui.ux3'
			},
			{
					name: 'sap.ui.suite',
					path: 'src/sap.ui.suite'
			},
			{
					name: 'themelib_sap_bluecrystal',
					path: 'src/themelib_sap_bluecrystal',
					type: 'theme'
			},
			{
					name: 'themelib_sap_goldreflection',
					path: 'src/themelib_sap_goldreflection',
					type: 'theme'
			}
		]
	};

	// determine set of libraries to use (specified by --libs option)
	gruntData.libraries = !libs ? gruntData.allLibraries : gruntData.allLibraries.filter(function(library) {
		return libs.indexOf(library.name) > -1;
	});

	// Load all grunt config files (in grunt subfolder) and all tasks installed via npm
	require('load-grunt-config')(grunt, {
	
		configPath: path.join(process.cwd(), 'grunt/config'),

		// loads grunt plugins just-in-time (faster than using load-grunt-tasks)
		jitGrunt: {
			staticMappings: {
				'replace': 'grunt-text-replace',
				'openui5_connect': 'grunt-openui5',
				'openui5_theme': 'grunt-openui5',
				'openui5_library_preload': 'grunt-openui5'
			}
		},

		data: gruntData

	});

};
