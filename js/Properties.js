
'use strict';

function YafloProperties(yaflo)
{
	var that = this;

	this.gui = new dat.GUI();
	this.exclude = [ 'removeElement', 'forEach' ];
	
	this.clearProperties = function ()
	{
		for (var i = 0; i < that.gui.__controllers.length; i++)
			that.gui.remove(that.gui.__controllers[i]);

		_.each(that.gui.__folders, function (elem, i) {
			if (elem == undefined)
				return ;
			that.gui.__folders[i].close();
			that.gui.__folders[i].domElement.parentNode.parentNode.removeChild(that.gui.__folders[i].domElement.parentNode);
			that.gui.__folders[i] = undefined;
			that.gui.onResize();
		});
	};

	this.showProperties = function (object)
	{
		that.clearProperties();

		that.addSimulatorGUI(that.gui);

		var folder = that.gui.addFolder(object.name);

		if (yaflo.simulator.running)
			folder.close();
		else
			folder.open();

		that.addProperty(object, folder);
	};

	this.addProperty = function (object, gui)
	{
		if (object._properties == undefined)
		{
			if (that.getPropertyType(object) == 'Array')
				that.addArrayGUI(object, gui);
			return ;
		}

		var property;
		var type;

		for (var i = 0; i < object._properties.length; i++)
		{
			property = object._properties[i];
			type = that.getPropertyType(object[property]);

			if (type == 'null')
				continue ;

			if (type == 'Array')
				that.addArrayGUI(object[property], gui);
			else if (typeof object[property] == 'object')
				that.addObjectGUI(object[property], gui);
			else
				gui.add(object, property).name(property.humanize());
		}
	};

	this.addSimulatorGUI = function (gui)
	{
		var folder = gui.addFolder('Simulator');

		if (yaflo.simulator.running)
			folder.open();
		else
			folder.close();

		that.addProperty(yaflo.simulator, folder);
	};

	this.addObjectGUI = function (object, gui)
	{
		var folder = gui.addFolder(object.name);
		folder.open();

		that.addProperty(object, folder);
	};

	this.addArrayGUI = function (array, gui)
	{
		var folder = gui.addFolder(array.name);
		folder.open();

		for (var i = 0; i < array.length; i++)
			that.addProperty(array[i], folder);
	};

	this.getPropertyType = function (property)
	{
		if (property === null || typeof property === 'undefined')
			return 'null';
		else if (typeof property == 'string')
			return 'String';
		else if (property.constructor == Array)
			return 'Array';
	};
}
