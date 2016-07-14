// The node.js modules used.
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

/**
 * Creates Centennial object.
 * @param {String} rootPath Root path for project
 * @param {Manifest} manifest Web manifest
 * @param {OutputIface} output Output
 * @constructor
 */
function Centennial(rootPath, manifest, output) {
    this._rootPath = rootPath;
    this._manifest = manifest;
    this._output = output;
}

Centennial.prototype.generateAppX =
function(app_path, xwalk_path, meta_data, callback) {
    var basename = meta_data.product + "-" + meta_data.version;
    this._output.info(basename + '-appx');
    var converter = "DesktopAppConverter.cmd -Installer " + meta_data.msi +
        " -InstallerArguments \"/S\"" +
        " -Destination " + basename + '-appx' +
        " -Version " + meta_data.version +
        " -Publisher \"CN=" + meta_data.manufacturer + "\"" +
        " -PackageName \"" + meta_data.app_name + "\"" +
        " -AppDisplayName \"" + meta_data.app_name + "\"" +
        " -PackagePublisherDisplayName \"" + meta_data.manufacturer + "\"" +
        " -MakeAppx";
    this._output.info("Running '" + converter + "'");
    var child = child_process.exec(converter);

    child.stdout.on("data", function(data) {
        this.onData(data);
    }.bind(this));

    child.on("exit", function(code, signal) {
        if (code) {
            this._output.error("Unhandled error " + code);
        }
        callback(code === 0);
        // Only delete on success, for debugging reasons.
        ShellJS.rm("-f", basename + "-appx");
        meta_data.appx = path.resolve(basename + ".appx");
        return;
    }.bind(this));
};

Centennial.prototype.onData =
function(data) {

};

module.exports = Centennial;