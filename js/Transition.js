
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
	this.condition = '';
	// this.conditions = [];
	this.conditions.name = 'Conditions';
	this.drawable = null;

	this._properties = [ 'name', 'condition', 'priority' ];

	this.isValid = function (variables)
	{
		if (that.condition.length === 0)
			return true;

		var func = new Function('return ('+ that.condition +');');

		return func.apply(variables);

		// var result = true;

		// _.each(that.conditions, function (condition) {
		// 	if (condition.test() === false)
		// 	{
		// 		result = false;
		// 		return false;
		// 	}
		// });

		// return result;
	};

	this.remove = function ()
	{
		this.fromState.removeTransition(that);
	};

	// this.createCondition = function (formula)
	// {
	// 	var condition = new YafloTransitionCondition(that, formula);

	// 	that.conditions.push(condition);

	// 	return condition;
	// };

	// this.removeCondition = function (condition)
	// {
	// 	that.conditions.removeElement(condition);
	// };
}
