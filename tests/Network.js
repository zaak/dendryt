const assert = require( 'assert' );

const Network = require( '../src/lib/Network' );
const LayerConnection = require( '../src/lib/connectionStrategy' );

describe( 'Network', () => {
	it( 'Network.create should correctly set layer types', () => {
		const layerDefinitions = [
			{ type: 'input', size: 5 }
		];

		for ( let i = 0; i < 3; ++i ) {
			layerDefinitions.push( { type: 'sigmoid', size: 10 } );
		}

		layerDefinitions.push( { type: 'softmax', size: 5 } );

		const network = Network.create( layerDefinitions );

		assert.strictEqual( network.inputLayer.type, 'input' );
		assert.strictEqual( network.hiddenLayers.length, 3 );

		for ( let i = 0; i < 3; ++i ) {
			assert.strictEqual( network.hiddenLayers[ i ].type, 'sigmoid' );
		}

		assert.strictEqual( network.outputLayer.type, 'softmax' );
		assert.strictEqual( network.outputLayer.isOutput, true );

	} );

	it( 'should save/restore network to/from JSON', () => {
		const network = Network.create( [
			{ type: 'input', size: 2 },
			{ type: 'sigmoid', size: 3 },
			{ type: 'sigmoid', size: 1 }
		] );

		const networkJSONString = JSON.stringify( network );

		const restoredNetwork = Network.fromJSON( JSON.parse( networkJSONString ) );

		assert.deepStrictEqual( network.toJSON(), restoredNetwork.toJSON() );
	} );

} );
