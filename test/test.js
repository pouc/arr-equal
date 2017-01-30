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

var a1 = {}, b1 = {}, c1 = {};
var a2 = [1, 2, 3], b2 = a2;

// shallow + order
// shallow + !order
// deep + order
// deep + !order

var tests = {
    nonArray: [
        [undefined,   [1, 3], false, false, false, false],
        ['toto',      [1, 3], false, false, false, false],
        ['[1, 3]',    [1, 3], false, false, false, false],
        [1,           [1, 3], false, false, false, false],
        [true,        [1, 3], false, false, false, false]
    ],
    arrayDiffSize: [
        [[1, 2, 3, 4, 5, 6, 7], [1, 3], false, false, false, false],
        [[],                    [1, 3], false, false, false, false]
    ],
    normal: [
        [[],                    [],                         true,  true,  true,  true],
        [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7],      true,  true,  true,  true],
        [['a', 'b', 'c'],       ['a', 'b', 'c'],            true,  true,  true,  true],
        [[a1, b1, c1],          [a1, b1, c1],               true,  true,  true,  true],
        [a2,                    b2,                         true,  true,  true,  true],
        [[a1, a2, b2],          [a1, a2, b2],               true,  true,  true,  true],
        [[a1, a2, b2],          [a1, b2, a2],               true,  true,  true,  true],
        [[a1, [1, 2, 3], b2],   [a1, [1, 2, 3], b2],        false, false, true,  true],
        [[a1, [1, 2, 3], b2],   [a1, b2, [1, 2, 3]],        false, false, true,  true],
        [[a1, [1, 2], b2],      [a1, b2, [1, 2]],           false, false, false, true],
        [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 7, 6],      false, true,  false, true],
        [[1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, [7]],    false, false, false, false],
        [[1, [2, 4, [5, 6]]],   [[[5, 6], 2, 4], 1],        false, false, false, true],
        [[1, 1, 2],             [1, 2, 2],                  false, false, false, false]
    ]
}

var test = function(set) {
    [{idx: 0, val:false}, {idx: 1, val:true}].forEach((deep) => {
        [{idx: 0, val:true}, {idx: 1, val:false}].forEach((order) => {
            set.forEach((testItem, index) => {
                expect(exports(testItem[0], testItem[1], {order: order.val, deep: deep.val})).to.equal(testItem[2 + deep.idx * 2 + order.idx]);
                expect(exports(testItem[1], testItem[0], {order: order.val, deep: deep.val})).to.equal(testItem[2 + deep.idx * 2 + order.idx]);
            });
        });
    });
}


describe('equal...', function() {

	it('should be defined', function() {
		expect(exports).to.not.be.undefined;
        expect(exports).to.be.a('function');
	});

    it('test on non arrays', function() {
        test(tests.nonArray);
    });
        
    it('test on arrays with different size', function() {
        test(tests.arrayDiffSize);
    });
        
    it('test normal arrays', function() {
        test(tests.normal);
    });

});