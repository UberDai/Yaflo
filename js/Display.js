
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
	this.drawables			= [];
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
			that.yaflo.states.forEach(function (state) {

				that.states.push(new YafloDrawable(state, that));
			});
		}
	}

	this.triggerStateCreation = function ()
	{
		that._updateCreationTriggers("state");

		if (that.creationTriggers.state == true)
			that.drawables.push(new YafloDrawable("state", that));
	}

	this.triggerTransitionCreation = function ()
	{
		that._updateCreationTriggers("transition");

		if (that.creationTriggers.transition == true)
			that.drawables.push(new YafloDrawable("transition", that));
	}

	this.translateWorld = function (e)
	{
		that.x -= e.canvasX - that.dragLastPos.x;
		that.y -= e.canvasY - that.dragLastPos.y;
	}

	this.resetCamera = function ()
	{
		c("Reset camera");
	
		that.translating = false;
		that.selecting = false;
		that.x = 0;
		that.y = 0;
		that.dragLastPos = {x: 0, y: 0};
	}

	this.bind = function ()
	{
		that.canvas.addEventListener('onContextMenu', that.event.handleEvent, true);
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
		if (that._creationTriggerOn() && e.which == 1)
		{
			that._removeCreationDrawable();
			that.addStateAtMousePosition(e);
			that._updateCreationTriggers("");
		}

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
			c("Create transition");
			//that._updateCreationTriggers("transition");
			//that.drawables.push(new YafloDrawable("transition", that));
		}
	}

	this._draw = function ()
	{
		that._updateCanvasSize();
		that.states.forEach(function (drawable) {
			drawable.draw();
		});
		that.transitions.forEach(function (drawable) {
			drawable.draw();
		});
		that.drawables.forEach(function (drawable) {
			drawable.draw();
		});
	}

	this._update = function ()
	{
		that.loadYaflo();
		that.states.forEach(function (drawable) {
			drawable.update();
		});
		that.transitions.forEach(function (drawable) {
			drawable.update();
		});
		that.drawables.forEach(function (drawable) {
			drawable.update();
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

		that.drawables.forEach(function (drawable, index) {

			if (drawable.spawner == "state" || drawable.spawner == "transition")
				toDelete.push(index);
		});

		toDelete.forEach(function (indexToDelete) {
			that.drawables.splice(indexToDelete, 1);
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
			new YafloDrawable(
					state,
					this,
					that.mousePos.x - Math.abs(that.x),
					that.mousePos.y + that.y,
					30,
					30
				)
			)
		;

		that.yaflo.select(that.yaflo.states[that.yaflo.states.length - 1]);
	}

	this._trySelecting = function (e)
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

		if (!ret)
		{
			that.yaflo.select(that.yaflo);
			if (that.selectedObject)
				that.selectedObject.selected = false;
			that.selectedObject = null;
		}
		return ret;
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

	this.drawables.push(new YafloDrawable("grid", this));
	this.bind();
	this._loop();
}
