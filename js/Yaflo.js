
'use strict';

function Yaflo(config)
{
	var that = this;

	this.name = 'Yaflo'
	this.config = config;
	this.canvas = config.container.querySelector('[data-role="canvas"]');
	this.event = new YafloEvent(this);
	this.display = new YafloDisplay(this);
	this.properties = new YafloProperties(this);
	this.simulator = new YafloSimulator(this);

	this.states = [];
	this.defaultState = null;
	this.variables = { name: 'Variables', _properties: [] };

	this._properties = [ 'variables' ];

	this.bind = function ()
	{
		//document.addEventListener('mousemove', that.event.handleEvent, true);
	};

	this.createState = function ()
	{
		var state = new YafloState(that);

		if (that.defaultState === null || that.states.length === 0)
			that.defaultState = state;

		that.states.push(state);

		return state;
	};

	this.select = function (object)
	{
		var display = that.display;
		this.selectedObject = object;
		that.updateProperties();

		if (object.drawable)
		{
			if (display.selectedObject != null)
				display.selectedObject.selected = false;
			display.selectedObject = object.drawable;
			display.selectedObject.selected = true;
		}
		else if (object == that)
		{
			if (display.selectedObject != null)
				display.selectedObject.selected = false;
			display.selectedObject = null;
		}
	};

	this.updateProperties = function ()
	{
		if (that.selectedObject)
			that.properties.showProperties(that.selectedObject, true);
		else
			that.properties.clearProperties();
	};

	this.addVariable = function (name, value)
	{
		if (that.variables[name] != undefined)
			return ;
		
		value || (value = 0);

		that.variables[name] = value;
		that.variables._properties.push(name);
	};

	this.removeVariable = function (name)
	{
		delete that.variables[name];
		that.variables._properties = _.without(that.variables._properties, name);
	};

	this.bind();
}
