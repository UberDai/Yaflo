
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
