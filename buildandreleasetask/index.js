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
        var fromPath = task.getInput('path');
        if (fromPath) {
            yield downloadAndInstallCliFromPath(fromPath);
        } else {


            yield downloadAndInstallSdk();
        }

    });
}
function findArchitecture() {
    if (os.platform() === 'darwin')
        return "macos";
    else if (os.platform() === 'linux')
        return "linux";
    return "windows";
}


function downloadAndInstallSdk() {
    return __awaiter(this, void 0, void 0, function* () {
        var dUrl = 'https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip';
        console.log(`Downloading latest CLI from ${dUrl}`);
        var cliZip = yield tool.downloadTool(dUrl);
        console.log(`Downloaded CLI zip bundle at ${cliZip}`);
        var cliDir = yield tool.extractZip(cliZip);
        console.log(`Extracted CLI Zip bundle at ${cliDir}`);
        console.log('Caching Maestro CLI');
        var arch = findArchitecture();
        tool.cacheDir(cliDir, 'Maestro', 'latest', arch);
        var maestroCliPath = cliDir + '/maestro/bin';
        console.log(`Adding ${maestroCliPath} PATH environment `);
        task.prependPath(maestroCliPath);

    });
}

function downloadAndInstallCliFromPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`CLi at path ${path}`);
        var cliDir = yield tool.extractZip(path);
        console.log(`Extracted CLI Zip bundle at ${cliDir}`);
        console.log('Caching Maestro CLI');
        var arch = findArchitecture();
        tool.cacheDir(cliDir, 'Maestro', 'custom', arch);
        var maestroPath = cliDir + '/maestro/bin';
        console.log(`Adding ${maestroPath} PATH environment `);
        task.prependPath(maestroPath);
    });
}

run().catch(error => {
    task.setResult(task.TaskResult.Failed, error);
});