
'use strict';

var yaflotransitioncount = 0;

function YafloTransition(fromState, toState)
{
	var that = this;
	yaflotransitioncount++;

	this.name = 'Transition '+ yaflotransitioncount;
	this.fromState = fromState;
	this.toState = toState;
	this.priority = 0;
	this.conditions = [];
	this.conditions.name = 'Conditions';

	this._properties = [ 'name', 'conditions', 'priority' ];

	this.isValid = function ()
	{
		var result = true;

		_.each(that.conditions, function (condition) {
			if (condition.test() === false)
			{
				result = false;
				return false;
			}
		});

		return result;
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
