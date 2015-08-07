
'use strict';

function YafloDrawable(parent, display, args)
{
	var that				= this;
	this.drawFunction		= undefined;
	this.updateFunction		= undefined;
	this.collisionFunction	= undefined;
	this.display			= display;
	this.ctx				= display.ctx;
	this.spawner			= parent;
	this.properties			= {};
	this.visible			= true;
	this.selected			= false;
	this.x 					= (typeof args !== "undefined") ? args['x'] || 0 : 0;
	this.y 					= (typeof args !== "undefined") ? args['y'] || 0 : 0;

	this.setPropertyFromArgs = function (index, args, def)
	{
		that.properties[index] = (typeof args !== "undefined") ? args[index] || def : def;
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
			initState(that, args);
		else if (that.spawner instanceof YafloTransition)
			initTransition(that, args);
		else if (that.spawner == "previsualisation state")
			initPrevisuState(that, args);
		else if (that.spawner == "previsualisation transition")
			initPrevisuTransition(that, args);
		else if (that.spawner == "grid")
			initGrid(that, args);
		else
			alert("wtf");
	}

	this._init(args);
}

function initState(drawable, args)
{
	drawable.setPropertyFromArgs('origin', args, {x: drawable.x, y: drawable.y});
	drawable.setPropertyFromArgs('w', args, 1);
	drawable.setPropertyFromArgs('h', args, 1);
	drawable.setPropertyFromArgs('r', args, 50);
	drawable.setPropertyFromArgs('fontSize', args, "16px");
	drawable.setPropertyFromArgs('font', args, "Courier New");
	drawable.setPropertyFromArgs('fontColor', args, "black");
	drawable.updateFunction = updateState;
	drawable.drawFunction = drawState;
	drawable.collisionFunction = collisionState;
}

function initTransition(drawable, args)
{
	drawable.setPropertyFromArgs('origin', args, null);
	drawable.setPropertyFromArgs('destination', args, null);
	drawable.setPropertyFromArgs('distanceThreshold', args, 15);
	drawable.updateFunction = updateTransition;
	drawable.drawFunction = drawTransition;
	drawable.collisionFunction = collisionTransition;
}

function initPrevisuState(drawable, args)
{
	drawable.updateFunction = updateCreatingState;
	drawable.drawFunction = drawCreatingState;
}

function initPrevisuTransition(drawable, args)
{
	drawable.setPropertyFromArgs('origin', args, null);
	drawable.updateFunction = updateCreatingTransition;
	drawable.drawFunction = drawCreatingTransition;
}

function initGrid(drawable, args)
{
	drawable.updateFunction = updateGrid;
	drawable.drawFunction = drawGrid;
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

function updateCreatingTransition(drawable)
{
	drawable.x = drawable.properties['origin'].x;
	drawable.y = drawable.properties['origin'].y;
	drawable.properties['endingPoint'] = {x: drawable.display.mousePos.x, y: drawable.display.mousePos.y};
}


function drawCreatingTransition(drawable)
{
	drawTransition(drawable);
}

function updateTransition(drawable)
{
	var dest = drawable.properties['destination'];

	drawable.x = drawable.properties['origin'].x;
	drawable.y = drawable.properties['origin'].y;
	drawable.properties['endingPoint'] = {x: dest.x, y: dest.y};
}

function drawTransition(drawable)
{
	var ctx = drawable.ctx;
	var end = drawable.properties['endingPoint'];

	ctx.beginPath();
	drawArrow(ctx, drawable.x, drawable.y, end.x, end.y);
	ctx.stroke();
}

function getMaxXFromTwoPoints(pointA, pointB)
{
	if (pointA.x > pointB.x)
		return pointA.x;
	else
		return pointB.x;
}

function getMinXFromTwoPoints(pointA, pointB)
{
	if (pointA.x < pointB.x)
		return pointA.x;
	else
		return pointB.x;
}

function getMaxYFromTwoPoints(pointA, pointB)
{
	if (pointA.y > pointB.y)
		return pointA.y;
	else
		return pointB.y;
}

function getMinYFromTwoPoints(pointA, pointB)
{
	if (pointA.y < pointB.y)
		return pointA.y;
	else
		return pointB.y;
}

function collisionTransition(drawable, e)
{
	var mousePos = drawable.display.mousePos;
	var max = {
		x: getMaxXFromTwoPoints(drawable.properties['origin'], drawable.properties['destination']),
		y: getMaxYFromTwoPoints(drawable.properties['origin'], drawable.properties['destination'])
	};
	var min = {
		x: getMinXFromTwoPoints(drawable.properties['origin'], drawable.properties['destination']),
		y: getMinYFromTwoPoints(drawable.properties['origin'], drawable.properties['destination'])
	};

	if (
		!((mousePos.x <= max.x && mousePos.x >= min.x && mousePos.y <= max.y && mousePos.y >= min.y)
				|| (max.x == min.x && mousePos.y <= max.y && mousePos.y >= min.y)
				|| (max.y == min.y && mousePos.x <= max.x && mousePos.x >= min.x))
	) {
		return false;
	}

	var distance = perpendicularDistance(drawable.properties['origin'], drawable.properties['destination'], drawable.display.mousePos);
	return distance <= drawable.properties['distanceThreshold'] ? true : false;
}

function drawArrow(context, fromX, fromY, toX, toY)
{
    var headlen = 10;
    var angle = Math.atan2(toY - fromY, toX - fromX);

    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI/6));
    context.moveTo(toX, toY);
    context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI/6));
}

function perpendicularDistance(lineA, lineB, point)
{
	var nominator = Math.abs((lineB.y - lineA.y) * point.x - (lineB.x - lineA.x) * point.y + lineB.x * lineA.y - lineB.y * lineA.x);
	var denominator = Math.sqrt(Math.pow(lineB.y - lineA.y, 2) + Math.pow(lineB.x - lineA.x, 2));
	return nominator / denominator;
}
