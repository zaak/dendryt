

// Layers
const Base = require( './Layer/Layer' );
const Input = require( './Layer/Input' );
const Relu = require( './Layer/Relu' );
const Sigmoid = require( './Layer/Sigmoid' );
const Softmax = require( './Layer/Softmax' );

module.exports = {
	Layer: { Base, Input, Relu, Sigmoid, Softmax }
};
