const logger = require('../../utils/logger');
const FileArtifact = require('../templates/artifact/FileArtifact');
const StartupAndTestRecorderPlugin = require('../templates/plugin/StartupAndTestRecorderPlugin');
const getTimeStampString = require('../utils/getTimeStampString');

/***
 * @abstract
 */
class LogArtifactPlugin extends StartupAndTestRecorderPlugin {
  constructor(config) {
    super(config);

    this.enabled = this.api.userConfig.lifecycle !== 'none';
    this.keepOnlyFailedTestsArtifacts = this.api.userConfig.lifecycle === 'failing';
  }

  async onAfterAll() {
    await super.onAfterAll();

    if (this.shouldKeepArtifactOfSession()) {
      this.api.requestIdleCallback(async () => {
        const [jsonLogPath, plainLogPath] = await Promise.all([
          this.api.preparePathForArtifact(`detox_pid_${process.pid}.json.log`),
          this.api.preparePathForArtifact(`detox_pid_${process.pid}.log`),
        ]);

        await Promise.all([
          new FileArtifact({ temporaryPath: logger.jsonFileStreamPath }).save(jsonLogPath),
          new FileArtifact({ temporaryPath: logger.plainFileStreamPath }).save(plainLogPath)
        ]);
      });
    }
  }

  async onBeforeShutdownDevice(event) {
    await super.onBeforeShutdownDevice(event);

    if (this.currentRecording) {
      await this.currentRecording.stop();
    }
  }

  async preparePathForStartupArtifact() {
    const deviceId = this.context.deviceId;
    const timestamp = getTimeStampString();

    return this.api.preparePathForArtifact(`${deviceId} ${timestamp}.startup.log`);
  }

  async preparePathForTestArtifact(testSummary) {
    return this.api.preparePathForArtifact('process.log', testSummary);
  }
}

module.exports = LogArtifactPlugin;
