const assert = require( 'assert' );

const { uid } = require( '../src/lib/utils' );

describe( 'utils', () => {
	describe( 'uid', () => {
		it( 'should generate valid UIDs', () => {
			assert( 1 === uid() );
			assert( 2 === uid() );
			assert( 1 === uid( 'foo' ) );
			assert( 2 === uid( 'foo' ) );
			assert( 1 === uid( 'bar' ) );
			assert( 2 === uid( 'bar' ) );
		} );
	} );
} );
