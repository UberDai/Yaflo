
'use strict';

function c(m)
{
	console.log.apply(console, arguments);
}

Element.prototype.remove = function ()
{
    this.parentElement.removeChild(this);
};

Number.prototype.clamp = function (min, max)
{
    return Math.min(Math.max(this, min), max);
};

String.prototype.humanize = function ()
{
	var str = this;

	for (var i = 0; i < str.length; i++)
	{
		if (str[i] == str[i].toUpperCase())
		{
			str = str.substr(0, i) +' '+ str[i].toLowerCase() + str.substr(i + 1);
			i++;
		}
	}

	return str[0].toUpperCase() + str.slice(1);
}

function Vector(x, y)
{
	var that = this;

	if (typeof x == "number" && typeof y == "number")
	{
		this.x = x;
		this.y = y;
	}
	else if (typeof x == "object" && typeof y == "object")
	{
		this.x = y.x - x.x;
		this.y = y.y - x.y;
	}
	else
		this.x = this.y = 0;

	this.__defineGetter__('magnitude', function () {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	});

	this.normalize = function ()
	{
		var magnitude = this.magnitude;

		return new Vector(this.x / magnitude, this.y / magnitude);
	};
}
