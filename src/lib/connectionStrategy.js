module.exports = {
	oneToAll: ( fromLayer, toLayer ) => {
		for ( const fromNeuron of fromLayer.neurons ) {
			for ( const toNeuron of toLayer.neurons ) {
				fromNeuron.connectTo( toNeuron );
			}
		}
	},
	oneToOne: ( fromLayer, toLayer ) => {
		if ( fromLayer.size !== toLayer.size ) {
			throw new Error( `Different layer size in ONE_TO_ONE connection (${fromLayer.size} and ${toLayer.size}).` );
		}

		const toNeurons = toLayer.neurons;
		const fromNeurons = fromLayer.neurons;

		for ( let i = 0; i < toNeurons.length; ++i ) {
			fromNeurons[ i ].connectTo( toNeurons[ i ] );
		}
	}
};
