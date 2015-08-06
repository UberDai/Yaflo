
'use strict';


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


function YafloDrawable(parent)
{
	var that = this;
	var drawFunction = undefined;
	var updateFunction = undefined;

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
