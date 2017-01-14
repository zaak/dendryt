const Layer = require( './Layer' );

class InputLayer extends Layer {
	constructor( ...args ) {
		super( ...args );
	}

	get type() {
		return 'input';
	}

	/**
	 * Input layer activates neurons a different way - it just
	 * passes received values directly to appropriate neuron outputs.
	 *
	 * @param {Array} values
	 */
	forward( values ) {
		if ( values.length !== this.neurons.length ) {
			throw new Error( `Invalid input values size (${values.length}) for input layer of size ${this.size}` );
		}

		let i = 0;

		return this.neurons.map( neuron => neuron.activationResult = values[ i++ ] );
	}
}

module.exports = InputLayer;
