const logger = require('../../utils/logger');
const argparse = require('../../utils/argparse');
const FileArtifact = require('../templates/artifact/FileArtifact');
const StartupAndTestRecorderPlugin = require('../templates/plugin/StartupAndTestRecorderPlugin');
const getTimeStampString = require('../utils/getTimeStampString');

/***
 * @abstract
 */
class LogArtifactPlugin extends StartupAndTestRecorderPlugin {
  constructor(config) {
    super(config);

    const recordLogs = argparse.getArgValue('record-logs');

    this.enabled = recordLogs && recordLogs !== 'none';
    this.keepOnlyFailedTestsArtifacts = recordLogs === 'failing';
  }

  async onAfterAll() {
    await super.onAfterAll();

    if (this.shouldKeepArtifactOfSession()) {
      const jsonLog = new FileArtifact({ temporaryPath: logger.jsonFileStreamPath });
      const plainLog = new FileArtifact({ temporaryPath: logger.plainFileStreamPath });

      this.api.requestIdleCallback(() => Promise.all([
        jsonLog.save(`detox_pid_${process.pid}.json.log`, { copy: true }),
        plainLog.save(`detox_pid_${process.pid}.log`, { copy: true }),
      ]));
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
