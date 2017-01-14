const Connection = require( './Connection' );
const { uid } = require( './utils' );

class Neuron {
	constructor() {
		this.uid = uid( 'neuron' );

		/** @type {Layer} layer */
		this.layer = null;

		/** @type {Array<Connection>} */
		this.inputConnections = [];

		/** @type {Array<Connection>} */
		this.outputConnections = [];

		this.state = 0;
		this.activationResult = 0;

		this.error = 0;

		// Default bias
		this.bias = Neuron.defaultBias;
	}

	/**
	 * Adds input connection.
	 *
	 * @param {Connection} connection
	 */
	addInputConnection( connection ) {
		this.inputConnections.push( connection );
	}

	/**
	 * Adds output connection.
	 *
	 * @param {Connection} connection
	 */
	addOutputConnection( connection ) {
		this.outputConnections.push( connection );
	}

	/**
	 * Checks if current neuron has an input connection from given neuron.
	 *
	 * @param {Neuron} neuron
	 *
	 * @return {Boolean}
	 */
	hasInputConnectionFrom( neuron ) {
		for ( const inputConnection of this.inputConnections ) {
			if ( neuron.uid === inputConnection.from.uid ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Checks if current neuron has an output connection to given neuron.
	 *
	 * @param {Neuron} neuron
	 *
	 * @return {Boolean}
	 */
	hasOutputConnectionTo( neuron ) {
		for ( const outputConnection of this.outputConnections ) {
			if ( neuron.uid === outputConnection.to.uid ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Connects current neuron output with given neuron input.
	 *
	 * @param {Neuron} toNeuron
	 * @param {Number} weight
	 */
	connectTo( toNeuron, weight = null ) {
		const connection = new Connection( this, toNeuron, weight );
		this.addOutputConnection( connection );
		toNeuron.addInputConnection( connection );
	}

	/**
	 * Activates the neuron during forward pass.
	 *
	 * @return {Number}
	 */
	activate() {
		this.state = this.bias;

		for ( const inputConnection of this.inputConnections ) {
			this.state += inputConnection.from.activationResult * inputConnection.weight;
		}

		return this.state;
	}

	/**
	 * Activates the neuron during forward pass and computes activation function result.
	 *
	 * @return {Number}
	 */
	forward() {
		this.activate();

		this.activationResult = this.layer.activationFunction.function( this.state );

		return this.activationResult;
	}

	/**
	 * Activates the neuron during backward pass.
	 *
	 * @param {Number} rate Learning rate.
	 */
	backward( rate ) {
		const derivative = this.layer.activationFunction.derivative( this.state );

		let error = 0;

		for ( const outputConnection of this.outputConnections ) {
			error += outputConnection.weight * outputConnection.to.error;
		}

		this.error = derivative * error;

		this.updateWeights( rate );
	}

	updateWeights( rate ) {
		// Change input weights
		for ( const inputConnection of this.inputConnections ) {
			inputConnection.weight += rate * inputConnection.from.activationResult * this.error;
		}

		// Change bias
		this.bias += rate * this.error;
	}

	static get defaultBias() {
		return Math.random() * 0.2 - 0.1;
	}
}

module.exports = Neuron;
