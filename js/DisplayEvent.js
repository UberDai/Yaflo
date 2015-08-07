
'use strict';

function YafloDisplayEvent(yaflo)
{
	var that = this;
	var displayer = yaflo;

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
			displayer.onMouseMove(e);
		else if (e.type == 'mousewheel')
			displayer.onMouseWheel(e);
		else if (e.type == 'mousedown')
			displayer.onMouseDown(e);
		else if (e.type == 'mouseup')
			displayer.onMouseUp(e);
		else if (e.type == 'dblclick')
			displayer.onDoubleClick();
/*		else if (e.type == 'keydown' && e.keyCode == 83)
			displayer.triggerStateCreation();
		else if (e.type == 'keydown' && e.keyCode == 84)
			displayer.triggerTransitionCreation();*/
	};
}
