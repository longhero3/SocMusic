/**
* UnknownUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
    name: {
      required: true,
      type: 'string'
    },

    secret: {
      required: true,
      type: 'string'
    },

    songChannel: {
      model: 'song'
    }
  },

  generateUser: function(){
    var eden = require('node-eden');
    var crypto = require('crypto');
    return {
      name: eden.word(),
      secret: crypto.randomBytes(20).toString('hex')
    }
  }
};

