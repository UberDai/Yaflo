
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

Object.prototype.removeElement = function (element)
{
	var index = this.indexOf(element);

	if (index === -1)
		return false;

	this.splice(index, 1);

	return true;
}

Object.prototype.forEach = function (callback)
{
	var exclude = [ 'removeElement', 'forEach' ];
	var i = 0;

	for (var key in this)
	{
		if (exclude.indexOf(key) != -1)
			continue;

		if (callback(i, this[key]) === false)
			return ;
	}
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
