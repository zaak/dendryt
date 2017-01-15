const assert = require( 'assert' );

const Network = require( '../src/lib/Network' );
const Trainer = require( '../src/lib/Trainer' );
const costFunction = require( '../src/lib/costFunction' );

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

	it( 'should train network with semeion set', function() {
		// This test may take a while.
		this.timeout(2*60000);

		const network = Network.create( [
			{ type: 'input', size: 256 },
			{ type: 'tanh', size: 32 },
			{ type: 'softmax', size: 10 }
		] );

		const trainSets = require( './semeion.set' );

		const trainer = new Trainer( network, {
			costFunction: costFunction.CE, // For softmax layer cost should be calculated with cross-entropy function.
			learningRate: 0.1,
			iterations: 100000,
			shuffle: true,
			error: 0.005,
			logging: true
		} );

		trainer.train( trainSets );

		let recognized = 0, failed = 0;

		trainSets.forEach( ( { input, output } ) => {
			try {
				assert.deepEqual( normalizeNetResponse( network.forward( input ) ), output );
				recognized++;
			} catch ( e ) {
				failed++;
			}
		} );

		console.log( `Properly recognized digits: ${recognized}`);
		console.log( `Failed to recognize: ${failed}`);
		assert( failed < 0.01 * trainSets.length );

		// Normalize softmax layer response - pick the highest possibility
		// and mark it as 1, and set 0 to others.
		function normalizeNetResponse( arr ) {
			let highestIndex = 0;

			arr.forEach( ( v, i ) => {
				if ( v > arr[ highestIndex ] ) {
					highestIndex = i;
				}
			} );

			const result = arr.map( v => 0 );
			result[ highestIndex ] = 1;

			return result;
		}
	} );
} );
