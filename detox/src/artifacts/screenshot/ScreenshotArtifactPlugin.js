const TwoSnapshotsPerTestPlugin = require('../templates/plugin/TwoSnapshotsPerTestPlugin');

/***
 * @abstract
 */
class ScreenshotArtifactPlugin extends TwoSnapshotsPerTestPlugin {
  constructor(config) {
    super(config);

    const { userConfig } = this.api;
    this.enabled = userConfig.lifecycle !== 'none';
    this.shouldTakeAutomaticSnapshots = userConfig.lifecycle === 'failing' || userConfig.lifecycle === 'all';
    this.keepOnlyFailedTestsArtifacts = userConfig.lifecycle === 'failing';
  }

  async preparePathForSnapshot(testSummary, name) {
    return this.api.preparePathForArtifact(`${name}.png`, testSummary);
  }
}

module.exports = ScreenshotArtifactPlugin;
