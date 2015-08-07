
'use strict';

function YafloDrawable(parent, display, args)
{
	var that				= this;
	var drawFunction		= undefined;
	var updateFunction		= undefined;
	var collisionFunction	= undefined;

	this.display			= display;
	this.ctx				= display.ctx;
	this.spawner			= parent;
	this.properties			= {};
	this.visible			= true;
	this.selected			= false;
	this.x 					= typeof args !== "undefined" ? args['x'] || 0 : 0;
	this.y 					= typeof args !== "undefined" ? args['y'] || 0 : 0;

	this._setPropertyFromArgs = function (index, args, def)
	{
		that.properties[index] = typeof args !== "undefined" ? args[index] || def : def;
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

	this.collidesWith = function (e)
	{
		if (that.collisionFunction != undefined)
			return that.collisionFunction(that, e);
		c("No collision function linked to this drawable");
		return false;
	}

	this._init = function (args)
	{
		if (that.spawner instanceof YafloState)
		{
			that._setPropertyFromArgs('origin', args, {x: that.x, y: that.y});
			that._setPropertyFromArgs('w', args, 1);
			that._setPropertyFromArgs('h', args, 1);
			that._setPropertyFromArgs('r', args, 50);
			that._setPropertyFromArgs('fontSize', args, "16px");
			that._setPropertyFromArgs('font', args, "Courier New");
			that._setPropertyFromArgs('fontColor', args, "black");
			that.updateFunction = updateState;
			that.drawFunction = drawState;
			that.collisionFunction = collisionState;
		}
		else if (that.spawner instanceof YafloTransition)
		{
			that.updateFunction = updateTransition;
			that.drawFunction = drawTransition;
			that.collisionFunction = collisionTransition;
		}
		else if (that.spawner == "state")
		{
			that.updateFunction = updateCreatingState;
			that.drawFunction = drawCreatingState;
		}
		else if (that.spawner == "transition")
		{
			that.updateFunction = updateCreatingTransition;
			that.drawFunction = drawCreatingTransition;
		}
		else if (that.spawner == "grid")
		{
			that.updateFunction = updateGrid;
			that.drawFunction = drawGrid;
		}	
	}

	this._init(args);
}

function updateGrid(drawable)
{
	drawable.x = -drawable.display.x;
	drawable.y = -drawable.display.y;
}

function drawGrid(drawable)
{
	var ctx = drawable.ctx;
	var rekt = drawable.display.canvas.getBoundingClientRect();

	ctx.beginPath();
	ctx.moveTo(drawable.x, 0);
	ctx.lineTo(drawable.x, rekt.height);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, drawable.y);
	ctx.lineTo(rekt.width, drawable.y);
	ctx.stroke();
}

function updateCreatingState(drawable)
{
	drawable.x = drawable.display.mousePos.x + Math.round(drawable.properties['w'] / 2);
	drawable.y = drawable.display.mousePos.y - Math.round(drawable.properties['h'] / 2);
}

function drawCreatingState(drawable)
{
	drawState(drawable);
}

function updateState(drawable)
{
	drawable.x = -drawable.display.x + drawable.properties['origin'].x;
	drawable.y = -drawable.display.y + drawable.properties['origin'].y;

	if (drawable.selected && drawable.properties['fontColor'] != "red")
		drawable.properties['fontColor'] = "red";
	else
		drawable.properties['fontColor'] = "black";

}

function drawState(drawable)
{
	var ctx = drawable.ctx;
	var zoom = drawable.zoom;
	var state = drawable.spawner;

	ctx.beginPath();
	ctx.arc(drawable.x, drawable.y, drawable.properties['r'], 0, 2 * Math.PI);
	ctx.stroke();

	ctx.fillStyle = drawable.properties['fontColor'];
	ctx.font = drawable.properties['fontSize'] + " " + drawable.properties['font'];

	var nameSizeOnCanvas = ctx.measureText(state.name);
	ctx.fillText(state.name, drawable.x - Math.round(nameSizeOnCanvas.width / 2), drawable.y + 4);
}

function collisionState(drawable, e)
{
	if (
		Math.sqrt((drawable.x - e.canvasX) * (drawable.x - e.canvasX)
			+ (drawable.y - e.canvasY) * (drawable.y - e.canvasY))
		< (drawable.properties['r'] + 2)
	) {
		return true;
	}
	return false;
}

function updateTransition(drawable)
{
	c("Update transition");
}

function updateCreatingTransition(drawable)
{
	c("Update creating transition");
}

function drawTransition(drawable)
{
	c("Draw transition");
}

function drawCreatingTransition(drawable)
{
	c("Draw creating transition");
}
