const connectionStrategy = require( './connectionStrategy' );
const Neuron = require( './Neuron' );

const InputLayer = require( './Layer/Input' );
const ReluLayer = require( './Layer/Relu' );
const SigmoidLayer = require( './Layer/Sigmoid' );
const SoftmaxLayer = require( './Layer/Softmax' );

class Network {
	constructor( layers = [] ) {
		this.inputLayer = layers.shift();

		this.outputLayer = layers.pop();
		this.outputLayer.isOutput = true;

		this.hiddenLayers = layers;
	}

	/**
	 *
	 * @param {Array} values
	 */
	forward( values ) {
		this.inputLayer.forward( values );

		this.hiddenLayers.map( hiddenLayer => hiddenLayer.forward() );

		return this.outputLayer.forward();
	}

	/**
	 *
	 * @param rate
	 * @param {Array} values
	 */
	backward( rate, values ) {
		this.outputLayer.backward( rate, values );

		for ( let i = this.hiddenLayers.length - 1; i >= 0; --i ) {
			this.hiddenLayers[ i ].backward( rate );
		}
	}

	/**
	 *
	 * @return {{layers: Array, neurons: Array, connections: (Array|*|{})}}
	 */
	toJSON() {
		const allLayers = [ this.inputLayer, ...this.hiddenLayers, this.outputLayer ];
		let allNeurons = [];

		const layers = allLayers.map( ( layer ) => {
			allNeurons = allNeurons.concat( layer.neurons );

			return {
				uid: layer.uid,
				type: layer.type,
				neurons: layer.neurons.map( ( { uid } ) => uid )
			}
		} );

		const neurons = allNeurons.map( ( { uid, bias } ) => ( { uid, bias } ) );

		const connections = allNeurons
			.reduce( ( connections, neuron ) => connections.concat( neuron.outputConnections ), [] )
			.map( ( { from, to, weight } ) => ( { from: from.uid, to: to.uid, weight } ) );

		return { layers, neurons, connections };
	}

	static fromJSON( networkJSON ) {
		const { layers, neurons, connections } = networkJSON;

		/**
		 *
		 * @type {Map<Number, Neuron>}
		 */
		const neuronMap = new Map();

		neurons.forEach( ( { uid, bias } ) => {
			const neuron = new Neuron();
			neuron.uid = uid;
			neuron.bias = bias;

			neuronMap.set( neuron.uid, neuron );
		} );

		connections.forEach( ( { from, to, weight } ) => {
			const fromNeuron = neuronMap.get( from );
			const toNeuron = neuronMap.get( to );

			if ( !fromNeuron || !toNeuron) {
				throw new Error( `Couldn't create connection from Neuron(${from}) to Neuron(${to})`);
			}

			fromNeuron.connectTo( toNeuron, weight );
		} );

		const layerInstances = layers.map( ( { uid, type, neurons: layerNeurons } ) => {
			const layer = Network._createLayer( type, layerNeurons.length, false );
			layer.uid = uid;

			layerNeurons.forEach( ( neuronUid ) => {
				const neuron = neuronMap.get( neuronUid );

				if ( !neuron ) {
					throw new Error( `Couldn't find Neuron(${neuronUid}) for Layer(${layer.uid})`);
				}

				layer.addNeuron( neuron );
			} );

			return layer;
		} );

		return new Network( layerInstances );
	}

	/**
	 * Shorthand factory method that creates a network with layers given in following
	 * layer definitions. By default layers are connected with one-to-all strategy.
	 *
	 * @param {Array} layerDefinitions
	 */
	static create( layerDefinitions ) {
		const layers = layerDefinitions.map( ( layerDefinition ) => {
			return Network._createLayer( layerDefinition.type, layerDefinition.size );
		} );

		layers.reduce( ( l1, l2 ) => {
			l1.connectTo( l2, connectionStrategy.oneToAll );

			return l2;
		} );

		return new Network( layers );
	}

	/**
	 * Creates a layer instance of given type and size.
	 *
	 * @param {String} type
	 * @param {Number} size
	 * @param {Boolean} initialize
	 * @private
	 */
	static _createLayer( type, size, initialize = true ) {
		if ( !_layerTypeMap.hasOwnProperty( type ) ) {
			throw new Error( `Unknown layer type: ${type}` );
		}

		return new _layerTypeMap[ type ]( size, initialize );
	}
}

const _layerTypeMap = {
	input: InputLayer,
	relu: ReluLayer,
	sigmoid: SigmoidLayer,
	softmax: SoftmaxLayer
};

module.exports = Network;
