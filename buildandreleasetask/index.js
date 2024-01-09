"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const task = require("azure-pipelines-task-lib/task");
const tool = require("azure-pipelines-tool-lib/tool");
require("os");
const request = require("request-promise");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {

            var maestroVersion = task.getInput('version');
            var currentPlatform = yield  getCurrentPlatform();
            var downloadUrl = getMaestroSdkUrl(maestroVersion);
            yield downloadAndInstallSdk(downloadUrl, maestroVersion , currentPlatform);
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
function getCurrentPlatform() {
    return __awaiter(this, void 0, void 0, function* () {
        var platform = yield task.getPlatform();
        switch (platform) {
            case task.Platform.Windows:
                return 'windows';
            case task.Platform.Linux:
                return 'linux';
            case task.Platform.MacOS:
                return 'macos';
            default:
                throw Error('Unsupported platform');
        }
    });
}
function getMaestroSdkUrl(version) {
    if (version) {
        return 'https://github.com/mobile-dev-inc/maestro/releases/download/cli-$MAESTRO_VERSION/maestro.zip';
    } else {
        return 'https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip';
    }
}
function downloadAndInstallSdk(latestSdkDownloadUrl, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Downloading latest CLI from ${latestSdkDownloadUrl}`);
        var sdkBundle = yield tool.downloadTool(latestSdkDownloadUrl);
        console.log(`Downloaded CLI zip bundle at ${latestSdkDownloadUrl}`);
        var sdkExtractedBundleDir = yield tool.extractZip(sdkBundle);
        console.log(`Extracted CLI Zip bundle at ${sdkExtractedBundleDir}`);
        console.log('Caching Maestro CLI');
        tool.cacheDir(sdkExtractedBundleDir, 'Maestro', version? version : 'latest', arch);
        var maestroCliPath = sdkExtractedBundleDir + '/maestro/bin';
        console.log(`Adding ${maestroCliPath} PATH environment `);
        task.prependPath(maestroCliPath);
    });
}
run();