const assert = require( 'assert' );

const Neuron = require( '../src/lib/Neuron' );

describe( 'Neuron', () => {
	it( 'should have valid UIDs', () => {
		const n1 = new Neuron(),
			  n2 = new Neuron();

		assert( n1.uid != n2.uid );
	} );
} );
