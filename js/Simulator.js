
'use strict';

function YafloSimulator(yaflo)
{
	var that = this;

	this.running = false;
	this.paused = false;
	this.variables = null;
	this.delay = 1000;
	this.currentState = null;
	this.timer = null;
	this._properties = [ 'play', 'pause', 'stop', 'nextStep', 'delay', 'variables' ];

	this.play = function ()
	{
		that.paused = false;

		if (that.running)
			return that.nextStep();

		if (that.variables === null)
			that.getVariables();

		clearInterval(that.timer);
		that.running = true;
		yaflo.updateProperties();
		that.currentState = yaflo.defaultState;
		yaflo.select(that.currentState);
		that.timer = setTimeout(that.nextStep, that.delay);
	};

	this.pause = function ()
	{
		that.paused = true;
		clearInterval(that.timer);
	};

	this.stop = function ()
	{
		that.variables = null;
		that.running = false;
		that.paused = false;
		yaflo.updateProperties();
		clearInterval(that.timer);
	};

	this.nextStep = function ()
	{
		var transitions = that.currentState.transitions;
		var validTransitions = [];
		var chosenTransition = null;

		_.each(transitions, function (transition) {
			if (transition.isValid(that.variables))
				validTransitions.push(transition);
		});

		_.each(validTransitions, function (transition) {
			if (chosenTransition === null || chosenTransition.priority < transition.priority)
				chosenTransition = transition;
		});

		if (chosenTransition !== null)
		{
			that.currentState = chosenTransition.toState;
			yaflo.select(that.currentState);
		}

		if (that.running && !that.paused)
			that.timer = setTimeout(that.nextStep, that.delay);
	};

	this.getVariables = function ()
	{
		that.variables = _.clone(yaflo.variables);
	};
}
