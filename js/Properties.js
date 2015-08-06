
'use strict';

function YafloProperties(yaflo)
{
	var that = this;

	this.container = yaflo.config.container.querySelector('[data-role="properties"]');

	this.showProperties = function (object)
	{
		if (object instanceof YafloState)
			that.showStateProperties(object);
	};

	this.showStateProperties = function (state)
	{
		that.container.innerHTML = state.name;
	};
}