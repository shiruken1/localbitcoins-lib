'use strict';

const Q = require('q');
const util = require('util');

/**
 * Constructor
 *
 * TODO: Further normalise these classes.
 *
 * @param connection
 * @constructor
 */
 function Ad(connection) {
    var self = this;

    self.connection = connection;

    self.URI_PREFIX = '/api/';
    self.URI_API = {
        'create': 'ad-create/',
        'read': 'ad-get/',
        'update': 'ad/',
        'delete': 'ad-delete/',
        'all': 'ads/',
        'equation': 'ad-equation/'
    };

}

/**
 * Return the URI for this API call
 *
 * @param options - { currency: 'USD' }
 * @returns {string}
 */
Ad.prototype.getUri = function(options) {
    var self = this;

    if (!options.hasOwnProperty('type') || !options.type) {
        throw new Error('Invalid options. Type can not be found');
    }

    let returnStr = self.URI_PREFIX + self.URI_API[options.type];

    if (!options.hasOwnProperty('id') || !options.id) {
        switch(options.type) {
            case 'all': case 'read': case 'create': return returnStr;
            break;
            default: throw new Error('Invalid options. ID can not be found.');
            break;
        }
    }

    return returnStr + options.id + '/';
};

/**
 * Request info from an appropriate Ad API
 *
 * @param options - { currency: 'USD' }
 * @returns {boolean}
 */
Ad.prototype.getInfo = function(options) {
    var self = this;

    return Q.Promise(function(resolve, reject, notify) {
        if (!util.isFunction(self.getUri)) {
            reject(new Error('Function getUri is not defined!'));
        }
        if (self.getUri(options)) {
            if(options.type === 'all' || options.type === 'read' ) {
                self.connection.makeRequest({uri: self.getUri(options), uriParam: '', method: 'GET'})
                    .then(function (data) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (exp) {
                            reject(exp);
                        }
                    })
                    .fail(function (error) {
                        reject(error);
                    });
            } else {
                reject(new Error('Please use the submit method to POST to an AD API'));
            }
        } else {
            reject(new Error('Invalid options'));
        }
    });
};

/**
 * submit a POST to an appropriate Ad API
 *
 * @param options - { currency: 'USD' }
 * @param data - the appropriate payload for this POST
 * @returns {boolean}
 */
Ad.prototype.submit = function(options, data) {
    var self = this;

    return Q.Promise(function(resolve, reject, notify) {
        if (!util.isFunction(self.getUri)) {
            reject(new Error('Function getUri is not defined!'));
        }
        if (self.getUri(options)) {
            if(options.type !== 'all' || options.type !== 'read' ) {
                self.connection.makeRequest({uri: self.getUri(options), uriParam: data, method: 'POST'})
                    .then(function (data) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (exp) {
                            reject(exp);
                        }
                    })
                    .fail(function (error) {
                        reject(error);
                    });
            } else {
                reject(new Error('Please use the getInfo method to GET an AD API'));
            }
        } else {
            reject(new Error('Invalid options'));
        }
    });
};

module.exports = Ad;
