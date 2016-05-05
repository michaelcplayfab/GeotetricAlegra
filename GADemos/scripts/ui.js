"use strict";

var container;
var textBoxes = [];
var menus = [];

var TextBox = function(text, event) {
    this.text = text;
	this.menu = undefined;
    this.next = undefined;
    this.element = undefined;
    this.event = event;
};

TextBox.prototype.display = function() {
    this.element.innerHTML = '<p>' + this.text + '</p>';
    this.element.classList.remove('hidden');
    this.event && this.event();
};

TextBox.prototype.hide = function() {
    this.element.classList.add('hidden');
}

TextBox.prototype.progress = function(e) {
    if(this.menu) this.menu.hide();
	else this.hide();
	this.next.element.onclick = this.next.progress ? 
        this.next.progress.bind(this.next) : undefined;
    this.next.display();
    return this.next;
};

var Menu = function() {
    this.options = [];//options are textboxes
	this.element = document.createElement('div');//just a container for the menu options
	this.element.classList.add('menuContainer');
};

Menu.prototype.display = function() {
    this.options.forEach(function(el, i) {
        setTimeout(function() { this.options[i].display() }.bind(this), i * 100);
    }.bind(this));
};

Menu.prototype.hide = function() {
    this.options.forEach(function(el, i) {
		setTimeout(function() { this.options[i].hide() }.bind(this), i * 100);
    }.bind(this));
};

//set the value of next for the menu item whose result you want to be this chain 
//to the return value of this function
Menu.prototype.createTextBoxChain = function(textBoxChain) {
    textBoxChain.forEach(function(el, i) {
        textBoxChain[i].element = textBoxes[i % 2]; 
        textBoxChain[i].next = textBoxChain[i + 1]; 
    });
    textBoxChain[textBoxChain.length - 1].next = this;
    return textBoxChain[0];
};

function createTextBoxElement(visible) {
    var box = document.createElement('div');
    box.classList.add('textBox');
	!visible && box.classList.add('hidden');
    return box;
}

function setupUI() {
    //create the elements for the textbox chains
    textBoxes[0] = createTextBoxElement(false); 
    textBoxes[1] = createTextBoxElement(false);
    
    var menu = new Menu();
	menu.options = [ 
		new TextBox('Cody'), 
		new TextBox('Land'), 
		new TextBox('Geometric Algebra Basics')
	];
    
	menu.options[0].next = menu.createTextBoxChain([ 
		new TextBox('is'), new TextBox('AMAAAAZING', cody)
	]);
	menu.options[1].next = menu.createTextBoxChain([ 
		new TextBox('of'), new TextBox('spinning cubes.', basicCube), new TextBox('Aren\'t they neat?')
	]);
	
	menu.options[2].next = menu.createTextBoxChain([
		new TextBox('Looking at geometry and vector math, we deal with a lot of different constructs.'),
		new TextBox('Vectors, planes, areas, volumes, matrices...'),
		new TextBox('And with them, we have to learn a lot of different rules ' + 
					'and ways of getting from one to another.'),
		new TextBox('Geometric Algebra is a way for us to interact with the ' +
					'myriad geometric concepts all in one uniform way.'),
		new TextBox('This is a basis axis, which we\'ll call e<sub>1</sub>.', e1), 
		new TextBox('It represents a unit vector in the direction ' +
					'of one of our axes, which is <b>x</b> in this case.'),
		new TextBox('The reason it\'s spinning around is to make the point that it ' +
					'doesn\'t have to point in any particular direction, ' +
					'even though we identify it with x'),
		new TextBox('If we were working in 1D this would be our only axis, but we can go further.'),
		new TextBox('Here is the next basis vector for 2D, which we\'ll call e<sub>2</sub> ' +
					'or <b>y</b>, marked in blue', e2),
		new TextBox('And here, in green, is <b>z</b>, or e<sub>3</sub> for 3D.', e3),
        new TextBox('The important thing to notice is that all of these vectors are co-perpendicular.'),
        new TextBox('Going above the 3rd dimension, our basis axes are still considered to be "co-perpendicular", ' +
                    'but in a way that we can\'t perceive.'),
        new TextBox('Geometric Algebra allows for well-defined N-dimensional geometry, as seen in the game Miegakure.'), 
        new TextBox('This differs from linear algebra which works best in 3D ' +
                    'and below and has limited effectiveness above that.'),
		new TextBox('One interesting thing about geometric algebra is that its rules also ' +
					'apply to scalars, aka numbers.'),
        new TextBox('We treat them as 0-dimensional objects, which don\'t have ' + 
                    'a concrete geometric representation.'),
        new TextBox('This is because of how objects are conceptualized.'),
        new TextBox('An N-dimensional construct in GA is an <b>n-vector</b>.'),
        new TextBox('We have more specific terms for the lower dimensions: '),
        new TextBox('0D: scalars, 1D: vectors...'),
        new TextBox('In 2D, we have <b>bivectors</b> (which are similar to planes), ' +
                    'and in 3D we have <b>trivectors</b> (which are similar to volumes)...'),
        new TextBox('After that, we don\'t have any specific terms and just fall back on n-vector.'),
        new TextBox('GA objects are often combinations of the various n-vectors; ' +
                    'a generic GA object consisting of any number of n-vectors is a <b>multivector</b>.'),
        new TextBox('So what actually are bi and trivectors?', clear),
        new TextBox('Here\'s a demonstration of the outer product between e<sub>1</sub> and e<sub>2</sub>, ' + 
                    'which creates the bivector e<sub>12</sub>.', outerProduct)
	]);
	
	menu.options.forEach(function(el, i) { 
		menu.options[i].menu = menu;
        menu.options[i].event = clear;
		menu.options[i].element = createTextBoxElement(true);
		menu.options[i].element.onclick = menu.options[i].progress.bind(menu.options[i]);
		menu.options[i].display();
	});
	
	menus.push(menu);
	
	container.appendChild(textBoxes[0]);
	container.appendChild(textBoxes[1]);
	menus.forEach(function(menuEl, i) {
		container.appendChild(menuEl.element);
		menuEl.options.forEach(function(boxEl, i) {
			menuEl.element.appendChild(boxEl.element);
		});
	});
}

window.addEventListener('load', function() {
	container = document.getElementById('pop_ups');
	setupUI();
});