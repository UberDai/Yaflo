
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

	this._properties = [ 'name', 'condition', 'priority' ];

	this.isValid = function (variables)
	{
		if (that.condition.length === 0)
			return true;

		var declarations = '';
		
		_.each(variables, function (value, key) {
			if (key[0] == '_')
				return ;
			declarations += 'var '+ key +' = '+ JSON.stringify(value) +';';
		});

		var func = new Function(declarations +'return ('+ that.condition +');');

		return func.apply(variables);
	};

	this.getVariables = function (variable)
	{
		var variables = [];

		_.each(variables, function (_, key) {
			if (key[0] == '_')
				return ;
			variables.push(key);
		});

		return variables;
	}

	this.remove = function ()
	{
		this.fromState.removeTransition(that);
	};
}
