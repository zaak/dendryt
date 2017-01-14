const Layer = require( './Layer' );

class SigmoidLayer extends Layer {
	constructor( ...args ) {
		super( ...args );
	}

	get type() {
		return 'sigmoid';
	}

	get activationFunction() {
		const F = {
			function: ( x ) => 1 / ( 1 + Math.exp( -x ) ),
			derivative: ( x ) => {
				const fx = F.function( x );
				return fx * ( 1 - fx );
			}
		};

		return F;
	}
}

module.exports = SigmoidLayer;
