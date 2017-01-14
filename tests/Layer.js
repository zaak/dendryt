const assert = require( 'assert' );

const InputLayer = require( '../src/lib/Layer/Sigmoid' );
const SigmoidLayer = require( '../src/lib/Layer/Sigmoid' );
const connectionStrategy = require( '../src/lib/connectionStrategy' );

describe( 'Layer', () => {
	it( 'should have valid UIDs', () => {
		const l1 = new InputLayer(1),
			  l2 = new InputLayer(1);

		assert( l1.uid != l2.uid );
	} );

	it( 'should correctly connect neurons with one-to-all strategy', () => {
		const l1 = new InputLayer( 2 ),
			  l2 = new SigmoidLayer( 2 );

		l1.connectTo( l2, connectionStrategy.oneToAll );

		for ( const l1Neuron of l1.neurons ) {
			for( const l2Neuron of l2.neurons ) {
				assert( l1Neuron.hasOutputConnectionTo( l2Neuron ) );
				assert( l2Neuron.hasInputConnectionFrom( l1Neuron ) );

				assert( !l2Neuron.hasOutputConnectionTo( l1Neuron ) );
				assert( !l1Neuron.hasInputConnectionFrom( l2Neuron ) );
			}

			assert.strictEqual( l1Neuron.outputConnections.length, l2.size );
		}
	} );

	it( 'should correctly connect neurons with one-to-one strategy', () => {
		const l1 = new InputLayer( 2 ),
			  l2 = new SigmoidLayer( 2 );

		l1.connectTo( l2, connectionStrategy.oneToOne );

		const l1Neurons = l1.neurons;
		const l2Neurons = l2.neurons;


		assert.strictEqual( l1Neurons[ 0 ].outputConnections.length, 1 );
		assert.strictEqual( l1Neurons[ 1 ].outputConnections.length, 1 );

		assert( l1Neurons[ 0 ].hasOutputConnectionTo( l2Neurons[ 0 ] ) );
		assert( l1Neurons[ 1 ].hasOutputConnectionTo( l2Neurons[ 1 ] ) );
		assert( l2Neurons[ 0 ].hasInputConnectionFrom( l1Neurons[ 0 ] ) );
		assert( l2Neurons[ 1 ].hasInputConnectionFrom( l1Neurons[ 1 ] ) );
	} );
} );
