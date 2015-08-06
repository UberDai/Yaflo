
'use strict';

function YafloSimulator(yaflo)
{
	var that = this;

	this.running = false;
	this.paused = false;
	this.variables = null;
	this.delay = 1000;
	this.currentState = null;
	this._properties = [ 'play', 'pause', 'stop', 'nextStep', 'delay', 'variables' ];

	this.play = function ()
	{
		if (that.running && that.paused)
			that.nextStep();

		if (that.variables === null)
			that.getVariables();

		that.paused = false;
		that.running = true;
		yaflo.updateProperties();
		that.currentState = yaflo.defaultState;
		setTimeout(that.nextStep, that.delay);
	};

	this.pause = function ()
	{
		that.paused = true;
	};

	this.stop = function ()
	{
		that.variables = null;
		that.running = false;
		that.paused = false;
		yaflo.updateProperties();
	};

	this.nextStep = function ()
	{
		var transitions = that.currentState.transitions;
		var validTransitions = [];
		var chosenTransition = null;

		_.each(transitions, function (transition) {
			if (transition.isValid())
				validTransitions.push(transition);
		});

		_.each(validTransitions, function (transition) {
			if (chosenTransition === null || chosenTransition.priority < transition.priority)
				chosenTransition = transition;
		});

		if (chosenTransition !== null)
			that.currentState = chosenTransition.toState;

		c('Current state is now '+ that.currentState.name);

		if (that.paused === false)
			setTimeout(that.nextStep, that.delay);
	};

	this.getVariables = function ()
	{
		that.variables = _.clone(yaflo.variables);
	};
}
