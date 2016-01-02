require('should');
var badge = require('../js/badge');

describe('badge', function() {
    it('getVideoIdFromUrl', function() {
        badge.getVideoIdFromUrl('/v=abc#def&ghi').should.equal('abc');
    });
});
