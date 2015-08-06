
'use strict';

var container = document.getElementById('yaflo');
var yaflo = new Yaflo({
	container: container
});

var state1 = yaflo.createState();
var state2 = yaflo.createState();

var transition = state1.linkTo(state2);
transition.createCondition('count == 1');

var transition2 = state2.linkTo(state1);
transition2.createCondition('count == 1');

yaflo.select(yaflo);
yaflo.simulator.play();