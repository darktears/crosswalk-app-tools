// Copyright © 2014 Intel Corporation. All rights reserved.
// Use  of this  source  code is  governed by  an Apache v2
// license that can be found in the LICENSE-APACHE-V2 file.

var AndroidProject = require("./AndroidProject");
var CommandParser = require("./CommandParser");
var Console = require("./Console");

/**
 * Main script.
 * @namespace main
 */

/**
 * Create skeleton project.
 * @param {String} packageId Identifier in the form of com.example.Foo
 * @param {Function} [callback] Callback returning true/false. 
 * @returns {Boolean} true on success.
 * @memberOf main
 * @private
 */
function create(packageId, callback) {

    // Handle callback not passed.
    if (!callback)
        callback = function() {};

    var project;
    try {
        project = new AndroidProject();
    } catch (e) {
        Console.error("Error: The Android SDK could not be found. " +
                      "Make sure the directory containing the 'android' " +
                      "executable is mentioned in the PATH environment variable.");
        callback(false);
    }

    project.generate(packageId, function(errno) {
        
        if (errorMsg) {
            // TODO explanatory message
            Console.error("Error: project creation failed.");
            callback(false);
        } else {
            callback(true);
        }
    });
}

/**
 * Display usage information.
 * @param {CommandParser} parser.
 * @memberOf main
 * @private
 */
function help(parser) {

    var buf = parser.help();
    console.log(buf);
}

/**
 * Display version information.
 * @memberOf main
 * @private
 */
function version() {

    console.log("-0 TODO fetch this from project.json");
}

function main() {

    var parser = new CommandParser(process.argv);
    var cmd = parser.getCommand();
    if (cmd) {

        switch (cmd) {
        case "create":
            var packageId = parser.createGetPackageId();
            create(packageId);
            break;
        case "update":
            var version = parser.updateGetVersion();
            console.log("TODO implement");
            break;
        case "build":
            var type = parser.buildGetType();
            console.log("TODO implement");
            break;
        case "help":
            help(parser);
            break;
        case "version":
            version();
            break;
        default:
            // TODO
        }

    } else {

        help(parser);
    }
}

module.exports = {

    main: main,

    test: {
        create: create,
        help: help,
        version: version
    }
};