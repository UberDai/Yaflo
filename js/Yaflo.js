
'use strict';

function Yaflo(config)
{
	var that = this;

	this.config = config;
	this.canvas = config.container.querySelector('[data-role="canvas"]');
	this.event = new YafloEvent(this);
	this.properties = new YafloProperties(this);

	this.states = [];
	this.defaultState = null;
	this.variables = {};

	this.bind = function ()
	{
		document.addEventListener('mousemove', that.event.handleEvent, true);
	};

	this.createState = function ()
	{
		var state = new YafloState(that);

		that.states.push(state);

		if (that.defaultState === null)
			that.defaultState = state;

		return state;
	};

	this.updateSize = function ()
	{
	};

	this.select = function (object)
	{
		this.selectedObject = object;

		if (object !== null)
			that.properties.showProperties(object);
	};

	this.bind();
}
