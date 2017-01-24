var promise = require('q');
var chai = require('chai');
var sinon = require('sinon');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
chai.use(require('chai-things'));

var expect = chai.expect;
var should = chai.should();

var exports = require('../index.js');

function check(done, f) {

	return promise().then(() => {
		try {
			return f();
		} catch (e) {
			return promise.reject(e);
		}
	}).then(() => {
		done();
	}).fail((err) => {
		done(err);
	}); 

}

describe('example...', function() {

	it('should be defined', function() {
		expect(exports.example).to.not.be.undefined;
	});
	
	it('should work', function() {
		expect(exports.example('hello')).to.equal('hello');
	});

});