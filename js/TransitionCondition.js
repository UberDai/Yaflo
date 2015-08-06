
'use strict';

function YafloTransitionCondition(transition, formula)
{
	var that = this;

	this.functions = {
		'greater': that.testGreater,
		'greaterOrEqual': that.testGreaterOrEqual,
		'lower': that.testLower,
		'lowerOrEqual': that.testLowerOrEqual,
		'equal': that.testEqual,
		'notEqual': that.testNotEqual
	};

	this.func = null;
	this.rType;
	this.rValue;
	this.lType;
	this.lValue;

	this.parse = function (formula)
	{
		var splits = formula.split(' ');

		c(splits);
	};

	this.test = function ()
	{
		for (var func in that.functions)
		{
			if (func == that.func)
				return that.functions[func](that.getLValue(), that.getRValue());
		}

		return false;
	};

	this.getLValue = function ()
	{
		if (that.lType == 'variable')
			return transition.fromState.yaflo.variables[that.lValue];

		return that.lValue;
	};

	this.getRValue = function ()
	{
		if (that.rType == 'variable')
			return transition.fromState.yaflo.variables[that.rValue];

		return that.rValue;
	};

	if (formula)
		this.parse(formula);
}
