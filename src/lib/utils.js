
const uidsMap = Object.create( null );

module.exports = {
	uid( name = 'default' ) {
		if ( ! ( name in uidsMap ) ) {
			uidsMap[ name ] = 1;
		}

		return uidsMap[ name ]++;
	},
	benchmark( fn ) {
		const start = process.hrtime();
		fn();
		return process.hrtime( start );
	}
};
