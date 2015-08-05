
'use strict';

function YafloEvent(yaflo)
{
	var that = this;

	this._injectPosition = function (e)
	{
		var box = yaflo.canvas.getBoundingClientRect();

		e.canvasX = e.clientX - box.left;
		e.canvasY = e.clientY - box.top;
		e.inCanvas = (e.canvasX >= 0 && e.canvasY >= 0 && e.canvasX <= box.width && e.canvasY <= box.height);
	};

	this.handleEvent = function (e)
	{
		that._injectPosition(e);

		if (e.type == 'mousemove')
			that.onMouseMove(e);
	};

	this.onMouseMove = function (e)
	{
		c(e.canvasX, e.canvasY, e.inCanvas)
	};
}
