const Layer = require( './Layer' );

class TanhLayer extends Layer {
	constructor( ...args ) {
		super( ...args );
	}

	get type() {
		return 'tanh';
	}

	get activationFunction() {
		const F = {
			function: ( x ) => 2 / ( 1 + Math.exp( -2 * x ) ) - 1,
			derivative: ( x ) => {
				const fx = F.function( x );
				return 1 - Math.pow( fx, 2 );
			}
		};

		return F;
	}
}

module.exports = TanhLayer;
