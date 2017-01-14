const Layer = require( './Layer' );

class ReluLayer extends Layer {
	constructor( ...args ) {
		super( ...args );
	}

	get type() {
		return 'relu';
	}

	get activationFunction() {
		return {
			function: ( x ) => x > 0 ? x : 0,
			derivative: ( x ) => x > 0 ? 1 : 0
		};
	}
}

module.exports = ReluLayer;
