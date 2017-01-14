const assert = require( 'assert' );

const Network = require( '../src/lib/Network' );
const Trainer = require( '../src/lib/Trainer' );

describe( 'Trainer', () => {
	it( 'should train AND gate', () => {
		const network = Network.create( [
			{ type: 'input', size: 2 },
			{ type: 'sigmoid', size: 1 }
		] );

		const trainSets = [
			{ input: [ 0, 0 ], output: [ 0 ] },
			{ input: [ 1, 0 ], output: [ 0 ] },
			{ input: [ 0, 1 ], output: [ 0 ] },
			{ input: [ 1, 1 ], output: [ 1 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 2000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( network.forward( input ).map( Math.round ), output );
		} );
	} );

	it( 'should train OR gate', () => {
		const network = Network.create( [
			{ type: 'input', size: 2 },
			{ type: 'sigmoid', size: 1 }
		] );

		const trainSets = [
			{ input: [ 0, 0 ], output: [ 0 ] },
			{ input: [ 1, 0 ], output: [ 1 ] },
			{ input: [ 0, 1 ], output: [ 1 ] },
			{ input: [ 1, 1 ], output: [ 1 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 2000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( network.forward( input ).map( Math.round ), output );
		} );
	} );

	it( 'should train XOR gate', () => {
		const network = Network.create( [
			{ type: 'input', size: 2 },
			{ type: 'sigmoid', size: 3 },
			{ type: 'sigmoid', size: 1 }
		] );

		const trainSets = [
			{ input: [ 0, 0 ], output: [ 0 ] },
			{ input: [ 1, 0 ], output: [ 1 ] },
			{ input: [ 0, 1 ], output: [ 1 ] },
			{ input: [ 1, 1 ], output: [ 0 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 100000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( network.forward( input ).map( Math.round ), output );
		} );
	} );

	it( 'should train NOT gate', () => {
		const network = Network.create( [
			{ type: 'input', size: 1 },
			{ type: 'sigmoid', size: 1 }
		] );

		const trainSets = [
			{ input: [ 0 ], output: [ 1 ] },
			{ input: [ 1 ], output: [ 0 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 2000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( network.forward( input ).map( Math.round ), output );
		} );
	} );

	it( 'should learn binary incrementation', () => {
		const network = Network.create( [
			{ type: 'input', size: 3 },
			{ type: 'sigmoid', size: 5 },
			{ type: 'sigmoid', size: 3 }
		] );

		const trainSets = [
			{ input: [ 0, 0, 0 ], output: [ 0, 0, 1 ] },
			{ input: [ 0, 0, 1 ], output: [ 0, 1, 0 ] },
			{ input: [ 0, 1, 0 ], output: [ 0, 1, 1 ] },
			{ input: [ 0, 1, 1 ], output: [ 1, 0, 0 ] },
			{ input: [ 1, 0, 0 ], output: [ 1, 0, 1 ] },
			{ input: [ 1, 0, 1 ], output: [ 1, 1, 0 ] },
			{ input: [ 1, 1, 0 ], output: [ 1, 1, 1 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 100000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( network.forward( input ).map( Math.round ), output );
		} );
	} );

	it( 'network should be trained when restored from JSON', () => {
		// Train for XOR
		const network = Network.create( [
			{ type: 'input', size: 2 },
			{ type: 'sigmoid', size: 3 },
			{ type: 'sigmoid', size: 1 }
		] );

		const trainSets = [
			{ input: [ 0, 0 ], output: [ 0 ] },
			{ input: [ 1, 0 ], output: [ 1 ] },
			{ input: [ 0, 1 ], output: [ 1 ] },
			{ input: [ 1, 1 ], output: [ 0 ] }
		];

		const trainer = new Trainer( network, {
			learningRate: 0.1,
			iterations: 100000,
			shuffle: true,
			error: 0.01
		} );

		trainer.train( trainSets );

		// Save and restore from JSON
		const restoredNetwork = Network.fromJSON( JSON.parse( JSON.stringify( network ) ) );

		trainSets.forEach( ( { input, output } ) => {
			assert.deepEqual( restoredNetwork.forward( input ).map( Math.round ), output );
		} );
	} );
} );
