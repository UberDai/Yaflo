
'use strict';

function YafloDrawable(parent, display, x, y, w, h, r)
{
	var that = this;
	var drawFunction = undefined;
	var updateFunction = undefined;
	var collisionFunction = undefined;

	this.display = display;
	this.ctx = display.ctx;
	this.spawner = parent;
	this.visible = true;
	this.selected = false;
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.r = r || 50;
	this.fontSize = "16px";
	this.font = "Courier New";
	this.fontColor = "black";
	this.origin = {x: this.x, y: this.y};

	this._determineMethods = function ()
	{
		if (that.spawner instanceof YafloState)
		{
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
	drawable.x = drawable.display.mousePos.x + Math.round(drawable.w / 2);
	drawable.y = drawable.display.mousePos.y - Math.round(drawable.h / 2);
}

function drawCreatingState(drawable)
{
	drawState(drawable);
}

function updateState(drawable)
{
	drawable.x = -drawable.display.x + drawable.origin.x;
	drawable.y = -drawable.display.y + drawable.origin.y;

	if (drawable.selected && drawable.fontColor != "red")
		drawable.fontColor = "red";
	else
		drawable.fontColor = "black";

}

function drawState(drawable)
{
	var ctx = drawable.ctx;
	var zoom = drawable.zoom;
	var state = drawable.spawner;

	ctx.beginPath();
	ctx.arc(drawable.x, drawable.y, drawable.r, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.fillStyle = drawable.fontColor;
	ctx.font = drawable.fontSize + " " + drawable.font;

	var nameSizeOnCanvas = ctx.measureText(state.name);
	ctx.fillText(state.name, drawable.x - Math.round(nameSizeOnCanvas.width / 2), drawable.y + 4);
}

function collisionState(drawable, e)
{
	if (Math.sqrt((drawable.x - e.canvasX) * (drawable.x - e.canvasX) + (drawable.y - e.canvasY) * (drawable.y - e.canvasY)) < (drawable.r + 2))
		return true;
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
