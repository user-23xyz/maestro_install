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
Object.defineProperty(exports, "__esModule", { value: true });

const os = require("os");
const task = require("azure-pipelines-task-lib");
const tool = require("azure-pipelines-tool-lib/tool");



function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var maestroVersion = task.getInput('version');
        var currentPlatform = findArchitecture();
        var downloadUrl = getMaestroSdkUrl(maestroVersion);
        yield downloadAndInstallSdk(downloadUrl, maestroVersion, currentPlatform);
    });
}
function findArchitecture() {
    if (os.platform() === 'darwin')
        return "macos";
    else if (os.platform() === 'linux')
        return "linux";
    return "windows";
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
        tool.cacheDir(sdkExtractedBundleDir, 'Maestro', version ? version : 'latest', arch);
        var maestroCliPath = sdkExtractedBundleDir + '/maestro/bin';
        console.log(`Adding ${maestroCliPath} PATH environment `);
        task.prependPath(maestroCliPath);

    });
}
run().catch(error => {
    task.setResult(task.TaskResult.Failed, error);
});