const DataLogger = artifacts.require('./DataLogger.sol');

module.exports = (deployer) => {
    deployer.deploy(DataLogger);
};
