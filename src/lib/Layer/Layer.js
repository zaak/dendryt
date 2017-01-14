const Neuron = require( '../Neuron' );
const { uid } = require( '../utils' );
const connectionStrategy = require( '../connectionStrategy' );

/**
 * Abstract base for different layer types.
 */
class Layer {
	constructor( size, initialize = true ) {
		if ( new.target === Layer ) {
			throw new Error( 'Cannot construct Abstract Layer instances directly' );
		}

		if ( !size ) {
			throw new Error( 'Layer cannot be empty.' );
		}

		this.uid = uid( 'layer' );
		this.size = size;

		/** @type {Array<Neuron>} */
		this.neurons = [];

		if ( initialize ) {
			this.initialize();
		}

		// Flag used to mark output layer.
		this.isOutput = false;
	}

	get type() {
		throw new Error( 'Not implemented!' );
	}

	get activationFunction() {
		throw new Error( 'Not implemented' );
	}

	initialize() {
		for( let i = 0; i < this.size; ++i ) {
			const neuron = new Neuron();
			neuron.layer = this;
			this.addNeuron( neuron );
		}
	}

	addNeuron( neuron ) {
		neuron.layer = this;
		this.neurons.push( neuron );
	}

	/**
	 *
	 * @param {Layer} toLayer
	 * @param {Function} connectionStrategy
	 */
	connectTo( toLayer, connectionStrategy = connectionStrategy.oneToAll ) {
		connectionStrategy( this, toLayer );
	}

	/**
	 * Activates current layer during forward pass.
	 *
	 * @return {Array}
	 */
	forward() {
		return this.neurons.map( neuron => neuron.forward() );
	}

	/**
	 * Activates current layer during backward pass.
	 *
	 * @param {Number} rate
	 * @param {Array<Number>} target
	 */
	backward( rate, target = null ) {
		// Output layer calculates neuron errors a different way, so here we go.
		if ( this.isOutput ) {
			if ( target.length !== this.size ) {
				throw new Error( `Invalid backward input values size (${target.length}) for layer of size ${this.size}` );
			}

			for( let i = 0; i < target.length; ++i ) {
				const neuron = this.neurons[ i ];
				neuron.error = target[ i ] - neuron.activationResult;
				neuron.updateWeights( rate );
			}
		} else {
			this.neurons.forEach( ( neuron ) => neuron.backward( rate ) );
		}
	}
}

module.exports = Layer;