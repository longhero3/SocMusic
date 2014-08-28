/**
* Song.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,

  attributes: {
    name: {
      type: 'string',
      required: true
    },

    singer: {
      type: 'string',
      required: true
    },

    src: {
      type: 'string'
    },

    playCount: {
      type: 'integer',
      defaultsTo: 0
    }
  }
};

