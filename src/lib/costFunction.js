const { safeZero } = require( './const' );

module.exports = {
	// Mean Squared Error cost function
	// https://en.wikipedia.org/wiki/Mean_squared_error
	MSE: ( target, output ) => {
		let sum = 0;

		for ( let i = 0; i < output.length; ++i ) {
			sum += Math.pow( target[ i ] - output[ i ], 2 );
		}

		return sum / output.length;
	},
	// Cross-entropy cost function
	// http://neuralnetworksanddeeplearning.com/chap3.html#introducing_the_cross-entropy_cost_function
	CE: function( target, output ) {
		let sum = 0;

		for ( let i = 0; i < output.length; ++i ) {
			sum = ( target[ i ] * Math.log( output[ i ] || safeZero ) ) + ( ( 1 - target[ i ] ) * Math.log( ( 1 - output[ i ] ) || safeZero ) );
		}

		return -sum;
	}
};
