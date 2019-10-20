const _ = require('lodash');
const chalk = require('chalk').default;
const ReporterBase = require('./ReporterBase');

class WorkerAssignReporterImpl extends ReporterBase {
  constructor(detox) {
    super();
    this.device = detox.device;
  }

  report(workerName) {
    const deviceName = _.attempt(() => this.device.name);
    if (!_.isError(deviceName)) {
      this._traceln(`${chalk.whiteBright(workerName)} assigned to ${chalk.blueBright(this.device.name)}\n`);
    }
  }
}

module.exports = WorkerAssignReporterImpl;
