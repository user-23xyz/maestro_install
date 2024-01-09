import task = require('azure-pipelines-task-lib/task');
import tool = require('azure-pipelines-tool-lib/tool');
import 'os';
import tl = require('azure-pipelines-task-lib/task');


async function run() {
    try {
        var maestroVersion = task.getInput('version');
        var currentPlatform = await getCurrentPlatform();
        var downloadUrl = await getMaestroSdkUrl(maestroVersion);
        await downloadAndInstallSdk(downloadUrl, maestroVersion ?? 'latest', currentPlatform);
    }
    catch (err) {
        task.setResult(task.TaskResult.Failed, String(err));
    }
}

async function getMaestroSdkUrl(version: string | undefined): Promise<string> {
    if (version) {
        return 'https://github.com/mobile-dev-inc/maestro/releases/download/cli-$MAESTRO_VERSION/maestro.zip';
    } else {
        return 'https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip';
    }


}

async function getCurrentPlatform(): Promise<string> {
    var platform = await task.getPlatform();
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
}




async function downloadAndInstallSdk(latestSdkDownloadUrl: string, version: string, arch: string) {
    console.log(`Downloading latest CLI from ${latestSdkDownloadUrl}`);
    var sdkBundle = await tool.downloadTool(latestSdkDownloadUrl);
    console.log(`Downloaded CLI zip bundle at ${latestSdkDownloadUrl}`);
    var sdkExtractedBundleDir = await tool.extractZip(sdkBundle);
    console.log(`Extracted CLI Zip bundle at ${sdkExtractedBundleDir}`);
    console.log('Caching Maestro CLI');
    tool.cacheDir(sdkExtractedBundleDir, 'Maestro', version, arch);
    var maestroCliPath = sdkExtractedBundleDir + '/maestro/bin';
    console.log(`Adding ${maestroCliPath} PATH environment `);
    task.prependPath(maestroCliPath);
}

run();