const Layer = require( './Layer' );
const { safeZero } = require( '../const' );

class SoftmaxLayer extends Layer {
	constructor( ...args ) {
		super( ...args );
	}

	get type() {
		return 'softmax';
	}

	forward() {
		this.neurons.forEach( ( neuron ) => neuron.activate() );

		let sum = safeZero;

		this.neurons.forEach( ( neuron ) => {
			sum += Math.exp ( neuron.state );
		} );

		this.neurons.forEach( ( neuron ) => {
			neuron.activationResult = Math.exp( neuron.state ) / sum;
		} );

		return this.neurons.map( ( neuron ) => neuron.activationResult );
	}
}

module.exports = SoftmaxLayer;
