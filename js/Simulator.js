
'use strict';

function YafloSimulator(yaflo)
{
	var that = this;

	this.running = false;
	this.variables = null;
	this._properties = [ 'play', 'pause', 'stop', 'nextStep', 'variables' ];

	this.play = function ()
	{
		if (that.variables === null)
			that.getVariables();

		that.running = true;
		yaflo.updateProperties();
	};

	this.pause = function ()
	{

	};

	this.stop = function ()
	{
		that.variables = null;
		that.running = false;
		yaflo.updateProperties();
	};

	this.nextStep = function ()
	{

	};

	this.getVariables = function ()
	{
		that.variables = _.clone(yaflo.variables);
	};
}
