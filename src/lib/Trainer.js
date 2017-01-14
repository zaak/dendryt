const { MSE, CE } = require( './costFunction' );

class Trainer {
	/**
	 *
	 * @param {Network} network
	 * @param {Object} options
	 */
	constructor( network, options ) {
		this.network = network;
		this.options = Object.assign( {
			learningRate: 0.1,
			iterations: 1000,
			error: 0.01,
			shuffle: false,
			logging: false,
			costFunction: MSE
		}, options );
	}

	train( trainSets ) {
		let lastError = Infinity, errorSum = 0, iterations;

		for ( iterations = 0; iterations < this.options.iterations && lastError > this.options.error; ++iterations ) {
			errorSum = 0;

			if ( this.options.shuffle ) {
				trainSets = shuffle( trainSets );
			}

			trainSets.forEach( ( trainSet ) => {
				const { input, output } = trainSet;

				const networkOutput = this.network.forward( input );

				this.network.backward( this.options.learningRate, output );

				errorSum += this.options.costFunction( output, networkOutput );
			} );

			lastError = errorSum / trainSets.length;

			if ( this.options.logging ) {
				console.log( { error: lastError, iterations } );
			}
		}

		return { error: lastError, iterations };
	}
}

/**
 * Shuffles array in place.
 *
 * @param {Array} a
 */
function shuffle( a ) {
	for ( let j, x, i = a.length; i; j = Math.floor( Math.random() * i ), x = a[ --i ], a[ i ] = a[ j ], a[ j ] = x );

	return a;
}

module.exports = Trainer;
