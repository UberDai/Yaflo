
'use strict';

var yaflotransitionconditioncount = 0;

function YafloTransitionCondition(transition, formula)
{
	var that = this;
	yaflotransitionconditioncount++;

	this.name = 'Condition '+ yaflotransitionconditioncount;
	this.functions;

	this._formula = formula;
	this.func = null;
	this.rType;
	this.rValue;
	this.lType;
	this.lValue;

	this._properties = [ 'formula' ];

	this.init = function ()
	{
		that.functions = {
			'>': that.testGreater,
			'>=': that.testGreaterOrEqual,
			'<': that.testLower,
			'<=': that.testLowerOrEqual,
			'==': that.testEqual,
			'!==': that.testNotEqual
		};

		if (formula)
			this.parse(formula);
	};

	this.parse = function (formula)
	{
		that._formula = formula;
		var splits = formula.split(' ');

		that.setLValue(splits[0]);
		that.func = splits[1];
		that.setRValue(splits[2]);
	};

	this.test = function ()
	{
		for (var func in that.functions)
		{
			if (func == that.func)
				return that.functions[func](that.getLValue(), that.getRValue());
		}

		return null;
	};

	this.setLValue = function (value)
	{
		if (isNaN(value))
		{
			that.lType = 'variable';
			that.lValue = value;
			transition.fromState.yaflo.addVariable(value);
		}
		else
		{
			that.lType = 'number';
			that.lValue = ~~value;
		}
	};

	this.getLValue = function ()
	{
		if (that.lType == 'variable')
			return transition.fromState.yaflo.variables[that.lValue];

		return that.lValue;
	};

	this.setRValue = function (value)
	{
		if (isNaN(value))
		{
			that.rType = 'variable';
			that.rValue = value;
			transition.fromState.yaflo.addVariable(value);
		}
		else
		{
			that.rType = 'number';
			that.rValue = ~~value;
		}
	};

	this.getRValue = function ()
	{
		if (that.rType == 'variable')
			return transition.fromState.yaflo.variables[that.rValue];

		return that.rValue;
	};

	this.testGreater = function (lValue, rValue)
	{
		return (lValue > rValue);
	};

	this.testGreaterOrEqual = function (lValue, rValue)
	{
		return (lValue >= rValue);
	};

	this.testLower = function (lValue, rValue)
	{
		return (lValue < rValue);
	};

	this.testLowerOrEqual = function (lValue, rValue)
	{
		return (lValue <= rValue);
	};

	this.testEqual = function (lValue, rValue)
	{
		return (lValue == rValue);
	};

	this.testNotEqual = function (lValue, rValue)
	{
		return (lValue !== rValue);
	};

	this.init();
}

Object.defineProperties(YafloTransitionCondition.prototype, {
	formula:
	{
		get: function () { return this._formula; },
		set: function (val) { this.parse(val); }
	}
});
