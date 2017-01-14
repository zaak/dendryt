const Network = require( './lib/Network' );
const Neuron = require( './lib/Neuron' );
const Connection = require( './lib/Connection' );
const Trainer = require( './lib/Trainer' );

// Layers
const Base = require( './lib/Layer/Layer' );
const Input = require( './lib/Layer/Input' );
const Relu = require( './lib/Layer/Relu' );
const Sigmoid = require( './lib/Layer/Sigmoid' );
const Softmax = require( './lib/Layer/Softmax' );

const connectionStrategy = require( './lib/connectionStrategy' );
const constants = require( './lib/const' );
const costFunction = require( './lib/costFunction' );
const utils = require( './lib/utils' );

module.exports = {
	Network, Neuron, Connection, Trainer,
	Layer: { Base, Input, Relu, Sigmoid, Softmax },
	connectionStrategy, constants, costFunction, utils
};
