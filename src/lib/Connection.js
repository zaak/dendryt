const { uid } = require( './utils' );

/**
 * Represents a connection between two neurons.
 */
class Connection {
	/**
	 *
	 * @param {Neuron} from
	 * @param {Neuron} to
	 * @param {Number} weight
	 */
	constructor( from, to, weight = null ) {
		this.uid = uid( 'neuronConnection' );
		this.from = from;
		this.to = to;
		this.weight = weight === null ? Connection.defaultWeight : weight;
	}

	static get defaultWeight() {
		return Math.random() * 0.2 - 0.1;
	}
}

module.exports = Connection;
