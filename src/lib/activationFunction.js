const F = {
	logistic: {
		function: ( x ) => 1 / ( 1 + Math.exp( -x ) ),
		derivative: ( x ) => {
			const fx = F.logistic.function( x );
			return fx * ( 1 - fx );
		}
	},
	relu: {
		function: ( x ) => x > 0 ? x : 0,
		derivative: ( x ) => x > 0 ? 1 : 0
	}
};

module.exports = F;
