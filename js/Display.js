
'use strict';

function YafloDisplay(yaf)
{
	var that = this;

	this.yaflo				= yaf;
	this.canvas				= document.getElementById('screen-canvas');
	this.ctx				= this.canvas.getContext("2d");
	this.event				= new YafloDisplayEvent(this);
	this.translating		= false;
	this.selecting			= false;
	this.dragLastPos		= {x: 0, y: 0};
	this.selectedObject		= null;
	this.mousePos			= {x: 0, y: 0};
	this.creatingState		= false;
	this.creatingTransition	= false;
	this.temporaries		= [];
	this.states				= [];
	this.transitions		= [];
	this.zoom				= 0;
	this.x					= 0;
	this.y					= 0;
	this.creationTriggers	= {
		state: false,
		transition : false
	}

	this.loadYaflo = function ()
	{
		if (!that.yaflo.states)
			return ;

		if (that.yaflo.states.length != that.states.length)
		{
			that._resetDrawables();

			that.yaflo.states.forEach(function (state) {
				var drawableState = that._hasState(state);

				if (drawableState === false)
				{
					that.states.push(new YafloDrawable(state, that));
					drawableState = that.states[that.states.length - 1];
				}

				state.transitions.forEach(function (transition) {
					var drawableTransition = that._hasTransition(transition);

					if (drawableTransition === false)
					{
						var destDrawableState = that._hasState(transition.toState);

						if (destDrawableState === false)
						{
							that.states.push(new YafloDrawable(transition.toState, that));
							destDrawableState = that.states[that.states.length - 1];
						}
						var drawableTransition = new YafloDrawable(transition, that, {
							origin: drawableState,
							destination: destDrawableState
						});
						that.transitions.push(drawableTransition);
					}
				});
			});
			that.temporaries.push(new YafloDrawable("grid", this));
		}
	}

	this.triggerStateCreation = function ()
	{
		that._updateCreationTriggers("state");

		if (that.creationTriggers.state == true)
			that.temporaries.push(new YafloDrawable("previsualisation state", that));
	}

	this.triggerTransitionCreation = function ()
	{
		if (!that.selectedObject instanceof YafloState)
			return ;

		that._updateCreationTriggers("transition");

		if (that.creationTriggers.transition == true)
			that.temporaries.push(new YafloDrawable("previsualisation transition", that, {origin: that.selectedObject}));
	}

	this.deleteSelectedElement = function ()
	{
		if (that.selectedObject == null)
			return ;
		that.selectedObject.destroy();
		that._selectDefault();
	}

	this.translateWorld = function (e)
	{
		that.x -= e.canvasX - that.dragLastPos.x;
		that.y -= e.canvasY - that.dragLastPos.y;
	}

	this.resetCamera = function ()
	{
		that.translating = false;
		that.selecting = false;
		that.x = 0;
		that.y = 0;
		that.dragLastPos = {x: 0, y: 0};
	}

	this.bind = function ()
	{
		that.canvas.addEventListener('dblclick', that.event.handleEvent, true);
		that.canvas.addEventListener('mousedown', that.event.handleEvent, true);
		that.canvas.addEventListener('mouseup', that.event.handleEvent, true);
		that.canvas.addEventListener('mousemove', that.event.handleEvent, true);
		that.canvas.addEventListener('mousewheel', that.event.handleEvent, true);
		document.addEventListener('keydown', that.event.handleEvent, true);
	}

	this.onMouseMove = function (e)
	{
		that.mousePos = {x: e.canvasX, y: e.canvasY};

		if (that.translating)
			that.translateWorld(e);
		else if (that.selecting)
			that._moveSelectedObject(e);

		if (that.translating || that.selecting)
			that.dragLastPos = {x: e.canvasX, y: e.canvasY};
	}

	this.onMouseWheel = function (e)
	{
		that.zoom += e.wheelDelta > 0 ? 1 : -1;
		that.zoom = that.zoom.clamp(-30, 30);
	}

	this.onMouseDown = function (e)
	{
		if (e.which == 1 && that.creationTriggers.transition)
			that._createTransitionOrNot(e);

		if (e.which == 3 || e.which == 1)
		{
			that.translating = e.which == 3 ? true : false;

			if (e.which == 1)
				that.selecting = that._trySelecting(e);
			that.dragLastPos.x = e.canvasX;
			that.dragLastPos.y = e.canvasY;
		}

		if (e.which == 2)
			that.resetCamera();
	}

	this.onMouseUp = function (e)
	{
		if (e.which == 3 || e.which == 1)
		{
			that.translating = e.which == 3 ? false : that.translating;
			that.selecting = e.which == 1 ? false : that.selecting;
			that.dragLastPos = {x : 0, y: 0};
		}
	}

	this.onDoubleClick = function (e)
	{
		if (!that.selectedObject)
			that.addStateAtMousePosition(e);
		else if (that.selectedObject.spawner instanceof YafloState)
		{
			that.triggerTransitionCreation();
		}
	}

	this._draw = function ()
	{
		var drawables = [that.states, that.transitions, that.temporaries];
		that._updateCanvasSize();
		drawables.forEach(function (drawableArray) {
			drawableArray.forEach(function (drawable) {
				drawable.draw();
			});
		});
	}

	this._update = function ()
	{
		that.loadYaflo();
		var drawables = [that.states, that.transitions, that.temporaries];
		drawables.forEach(function (drawableArray) {
			drawableArray.forEach(function (drawable) {
				drawable.update();
			});
		});
	}

	this._loop = function ()
	{
		that._update();
		that._draw();
		window.requestAnimationFrame(that._loop);
	}

	this._updateCreationTriggers = function (trigger)
	{
		for (var index in that.creationTriggers)
		{
			var val = that.creationTriggers[index];

			if (index == trigger)
				that.creationTriggers[index] = !val;
			else
				that.creationTriggers[index] = false;

			if (val == true && that.creationTriggers[index] == false)
				that._removeCreationDrawable();
		}
	}

	this._creationTriggerOn = function ()
	{
		for (var index in that.creationTriggers)
		{
			if (that.creationTriggers[index] == true)
				return true;
		}
		return false;
	}

	this._removeCreationDrawable = function ()
	{
		var toDelete = [];

		that.temporaries.forEach(function (drawable, index) {

			if (drawable.spawner == "previsualisation state" || drawable.spawner == "previsualisation transition")
				toDelete.push(index);
		});

		toDelete.forEach(function (indexToDelete) {
			that.temporaries.splice(indexToDelete, 1);
		});
	}

	this._updateCanvasSize = function ()
	{
		var rekt = that.canvas.getBoundingClientRect();

		that.canvas.width = rekt.width;
		that.canvas.height = rekt.height;
	}

	this.addStateAtMousePosition = function (e)
	{
		var state = that.yaflo.createState();

		this.states.push(
			new YafloDrawable(state, this, {
				x: that.mousePos.x - Math.abs(that.x),
				y: that.mousePos.y + that.y,
				w: 30,
				h: 30,
				r: 50
			}))
		;

		that.yaflo.select(that.yaflo.states[that.yaflo.states.length - 1]);
	}

	this._trySelectingState = function(e)
	{
		var states = that.yaflo.states;
		var ret = false;

		that.states.forEach(function (state) {

			if (state.collidesWith(e) && ret == false)
			{
				that.yaflo.select(states[states.indexOf(state.spawner)]);

				if (that.selectedObject != null)
					that.selectedObject.selected = false;
				that.selectedObject = state;	
				that.selectedObject.selected = true;	
				ret = true;
			}
		});
		return ret;
	}

	this._trySelectingTransition = function(e)
	{
		var ret = false;

		that.transitions.forEach(function (transition) {

			if (transition.collidesWith(e) && ret == false)
			{
				that.yaflo.select(transition.spawner);

				if (that.selectedObject != null)
					that.selectedObject.selected = false;
				that.selectedObject = transition;	
				that.selectedObject.selected = true;	
				ret = true;
			}
		});
		return ret;
	}

	this._selectDefault = function ()
	{
		that.yaflo.select(that.yaflo);

		if (that.selectedObject)
			that.selectedObject.selected = false;
		that.selectedObject = null;
	}

	this._trySelecting = function (e)
	{
		if (that._trySelectingState(e) || that._trySelectingTransition(e))
			return true;
		that._selectDefault();
		return false;
	}

	this._moveSelectedObject = function (e)
	{
		if (!that.selectedObject)
		{
			c("No selected object to drag");
			return ;
		}
		that.selectedObject.properties['origin'].x = that.mousePos.x + that.x;
		that.selectedObject.properties['origin'].y = that.mousePos.y + that.y;
	}

	this._hasTransition = function (transition)
	{
		var ret = false;

		that.transitions.forEach(function (t) {
			var spawner = t.spawner;

			if (spawner.fromState == transition.fromState && spawner.toState == transition.toState)
				ret = t;
		});
		return ret;
	}

	this._hasState = function (state)
	{
		var ret = false;

		that.states.forEach(function (s) {
			var spawner = s.spawner;

			if (spawner === state)
				ret = s;
		});
		return ret;
	}

	this._resetDrawables = function()
	{
		that.states = [];
		that.transitions = [];
		that.temporaries = [];
	}

	this._createTransitionOrNot = function (e)
	{
		that.states.forEach(function (state) {

			if (state.collidesWith(e))
			{
				if (that.selectedObject != state)
				{
					var originState = that.selectedObject.spawner;
					originState.linkTo(state.spawner);
					var index = originState.transitions.length - 1;
					var drawable = new YafloDrawable(originState.transitions[index], that, {
						origin: that.selectedObject,
						destination: state
					});
					that.transitions.push(drawable);
				}
			}
		});
		that._updateCreationTriggers("transition");
		that._removeCreationDrawable();
	}

	this.temporaries.push(new YafloDrawable("grid", this));
	this.bind();
	this._loop();
}
