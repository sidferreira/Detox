const WholeTestRecorderPlugin = require('../templates/plugin/WholeTestRecorderPlugin');

class VideoArtifactPlugin extends WholeTestRecorderPlugin {
  constructor(config) {
    super(config);

    const { userConfig } = this.api;
    this.enabled = userConfig.lifecycle !== 'none';
    this.keepOnlyFailedTestsArtifacts = userConfig.lifecycle === 'failing';
  }

  async preparePathForTestArtifact(testSummary) {
    return this.api.preparePathForArtifact('test.mp4', testSummary);
  }
}

module.exports = VideoArtifactPlugin;
