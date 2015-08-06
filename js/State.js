
'use strict';

var yaflostatecount = 0;

function YafloState(yaflo)
{
	var that = this;
	yaflostatecount++;

	this.yaflo = yaflo;
	this.name = 'State '+ yaflostatecount;
	this.transitions = [];

	this._properties = [ 'name' ];

	this.linkTo = function (state)
	{
		if (that.isLinkedTo(state))
			return ;

		var transition = new YafloTransition(that, state);
		that.transitions.push(transition);

		return transition;
	};

	this.removeTransition = function (transition)
	{
		this.transitions.removeElement(transition);
	};

	this.isLinkedTo = function (state)
	{
		var transition;

		for (var i = 0; i < that.transitions.length; i++)
		{
			transition = that.transitions[i];

			if (transition.toState === state)
				return true;
		}

		return false;
	};
}
