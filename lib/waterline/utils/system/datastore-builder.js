//  ██████╗  █████╗ ████████╗ █████╗ ███████╗████████╗ ██████╗ ██████╗ ███████╗
//  ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
//  ██║  ██║███████║   ██║   ███████║███████╗   ██║   ██║   ██║██████╔╝█████╗
//  ██║  ██║██╔══██║   ██║   ██╔══██║╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
//  ██████╔╝██║  ██║   ██║   ██║  ██║███████║   ██║   ╚██████╔╝██║  ██║███████╗
//  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
//
//  ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗
//  ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗
//  ██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝
//  ██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗
//  ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║
//  ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝
//
// Builds up the set of datastores used by the various Waterline Models.

var _ = require('@sailshq/lodash');
var API_VERSION = require('../../VERSION');

module.exports = function DatastoreBuilder(adapters, datastoreConfigs) {
  var datastores = {};

  // For each datastore config, create a normalized, namespaced, dictionary.
  _.each(datastoreConfigs, function(config, datastoreName) {
    // Ensure that an `adapter` is specified
    if (!_.has(config, 'adapter')) {
      throw new Error('The datastore ' + datastoreName + ' is missing a required property (`adapter`). You should indicate the name of one of your adapters.');
    }

    // Ensure that the named adapter is present in the adapters that were passed
    // in.
    if (!_.has(adapters, config.adapter)) {
      // Check that the adapter's name was a string
      if (!_.isString(config.adapter)) {
        throw new Error('Invalid `adapter` property in datastore ' + datastoreName + '. It should be a string (the name of one of the adapters you passed into `waterline.initialize()`).');
      }

      // Otherwise throw an unknown error
      throw new Error('Unknown adapter ' + config.adapter + ' for datastore ' + datastoreName + '. You should double-check that the connection\'s `adapter` property matches the name of one of your adapters. Or perhaps you forgot to include your adapter when you called `waterline.initialize()`.)');
    }

    // Mix together the adapter's default config values along with the user
    // defined values.
    var datastoreConfig = _.merge({}, adapters[config.adapter].defaults, config, { version: API_VERSION });

    // Build the datastore config
    datastores[datastoreName] = {
      config: datastoreConfig,
      adapter: adapters[config.adapter],
      collections: []
    };
  });

  return datastores;
};
