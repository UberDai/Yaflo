
'use strict';

function YafloDisplay()
{
	var that = this;
	var translating = false;
	var selecting = false;
	var dragLastPos = {x: 0, y: 0};

	this.canvas = document.getElementById('screen-canvas');
	this.event = new YafloDisplayEvent(this);
	this.zoom = 0;
	this.x = 0;
	this.y = 0;

	this.translateWorld = function (e)
	{
		that.x += e.canvasX - dragLastPos.x;
		that.y += e.canvasY - dragLastPos.y;
		c("New world position ", this.x, this.y, e.canvasX - dragLastPos.x);
	}

	this.resetCamera = function ()
	{
		c("Reset camera");
	
		that.translating = false;
		that.selecting = false;
		that.x = 0;
		that.y = 0;
		dragLastPos = {x: 0, y: 0};
	}

	this.bind = function ()
	{
		that.canvas.addEventListener('onContextMenu', that.event.handleEvent, true);
		that.canvas.addEventListener('mousedown', that.event.handleEvent, true);
		that.canvas.addEventListener('mouseup', that.event.handleEvent, true);
		that.canvas.addEventListener('mousemove', that.event.handleEvent, true);
		that.canvas.addEventListener('mousewheel', that.event.handleEvent, true);
	}

	this.onMouseMove = function (e)
	{
		if (translating)
			that.translateWorld(e);
		else if (selecting)
			c("Move selection");

		if (translating || selecting)
			dragLastPos = {x: e.canvasX, y: e.canvasY};
	}

	this.onMouseWheel = function (e)
	{
		that.zoom += e.wheelDelta > 0 ? 1 : -1;
		that.zoom = that.zoom.clamp(-30, 30);
		c("Zoom level ", that.zoom, e.wheelDelta);
	}

	this.onMouseDown = function (e)
	{
		if (e.which == 3 || e.which == 1)
		{
			translating = e.which == 3 ? true : false;
			selecting = e.which == 1 ? true : false;
			dragLastPos.x = e.canvasX;
			dragLastPos.y = e.canvasY;
		}

		if (e.which == 2)
			that.resetCamera();
	}

	this.onMouseUp = function (e)
	{
		if (e.which == 3 || e.which == 1)
		{
			translating = e.which == 3 ? false : translating;
			selecting = e.which == 1 ? false : translating;
			dragLastPos = {x : 0, y: 0};
		}
	}

	this.bind();
}
