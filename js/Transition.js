
'use strict';

var yaflotransitioncount = 0;

function YafloTransition(fromState, toState)
{
	var that = this;
	yaflotransitioncount++;

	this.name = 'Transition '+ yaflotransitioncount;
	this.fromState = fromState;
	this.toState = toState;
	this.conditions = [];

	this.isValid = function ()
	{
		return false;
	};

	this.remove = function ()
	{
		this.fromState.removeTransition(that);
	};

	this.createCondition = function (formula)
	{
		var condition = new YafloTransitionCondition(that, formula);

		that.conditions.push(condition);

		return condition;
	};

	this.removeCondition = function (condition)
	{
		that.conditions.removeElement(condition);
	};
}
