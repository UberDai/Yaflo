
'use strict';

function YafloDrawable(parent, display)
{
	var that = this;
	var drawFunction = undefined;
	var updateFunction = undefined;

	this.display = display;
	this.ctx = display.ctx;
	this.spawner = parent;
	this.x = 0;
	this.y = 0;

	this._determineDrawMethods = function ()
	{
		if (that.spawner instanceof YafloState)
			that.drawFunction = drawState;
		else if (that.spawner instanceof YafloTransition)
			that.drawFunction = drawTransition;
		else if (that.spawner == "state")
			that.drawFunction = drawCreatingState;
		else if (that.spawner == "transition")
			that.drawFunction = drawCreatingTransition;
		else if (that.spawner == "grid")
			that.drawFunction = drawGrid;
	}

	this._determineUpdateMethods = function ()
	{
		if (that.spawner instanceof YafloState)
			that.updateFunction = updateState;
		else if (that.spawner instanceof YafloTransition)
			that.updateFunction = updateTransition;
		else if (that.spawner == "state")
			that.updateFunction = updateCreatingState;
		else if (that.spawner == "transition")
			that.updateFunction = updateCreatingTransition;
		else if (that.spawner == "grid")
			that.updateFunction = updateGrid;
	}

	this._determineMethods = function ()
	{
		that._determineDrawMethods();
		that._determineUpdateMethods();
	}

	this.draw = function ()
	{
		if (that.drawFunction != undefined)
			that.drawFunction(that);
		else
			c("No draw function linked to this drawable");
	}

	this.update = function ()
	{
		if (that.updateFunction != undefined)
			that.updateFunction(that);
		else
			c("No update function linked to this drawable");
	}

	this._determineMethods();
}

function updateGrid(drawable)
{
	drawable.x = -drawable.display.x;
	drawable.y = -drawable.display.y;
}

function drawGrid(drawable)
{
	var ctx = drawable.ctx;

	ctx.rect(drawable.x, drawable.y, 10, 10);
	ctx.stroke();
}

function updateState(drawable)
{
	c("Update state");
}

function updateTransition(drawable)
{
	c("Update transition");
}

function updateCreatingState(drawable)
{
	c("Update creating state");
}

function updateCreatingTransition(drawable)
{
	c("Update creating transition");
}

function drawState(drawable)
{
	c("Draw state");
}

function drawTransition(drawable)
{
	c("Draw transition");
}

function drawCreatingState(drawable)
{
	c("Draw creating state");
}

function drawCreatingTransition(drawable)
{
	c("Draw creating transition");
}

