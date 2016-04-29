"use strict";
if ( !Detector.webgl ) Detector.addGetWebGLMessage();

var Scene = function() {
    this.scene = undefined;
    this.update = undefined;
};

var canvas;
var camera, baseScene, scene, renderer;
var uniforms, clock;

function width()  { return window.innerWidth  * 0.8; }
function height() { return window.innerHeight * 0.8; }

function render() {
    requestAnimationFrame(render);
    
    var dt = clock.getDelta();
    scene.update && scene.update(dt);
    
    uniforms.time.value += dt;
    renderer.render(scene.scene, camera);
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width(), height(), false);
    //renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);

window.addEventListener('load', function() {
   if(!Detector.webgl) return;
   try {
       var initWidth  = window.innerWidth;
       var initHeight = window.innerHeight;
       
       baseScene = new Scene();
       baseScene.scene = new THREE.Scene();
       //defines fall-off fog; exponential and off-white, from 0.5 to 10
       //baseScene.scene.fog = new THREE.FogExp2(0xEEEEEE, 3, 10);
       
       //fov, aspect, near, far
       camera = new THREE.PerspectiveCamera(75, initWidth / initHeight, 0.1, 1000);
       camera.position.z = 5;
       
       canvas = document.querySelector('canvas');
	   //canvas.width  = initWidth;
	   //canvas.height = initHeight;
       renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
       renderer.setPixelRatio(1);
       renderer.setSize(width(), height(), false);
       //renderer.setViewport(0, 0, initWidth, initHeight);
       renderer.setClearColor(0xFFFFFF, 1);
       //renderer.shadowMapEnabled = true;
       
	   uniforms = {
			time : { type: "f", value: 0. },
			resolution: { type: "v2", value: new THREE.Vector2 }
		};
	   
       clock = new THREE.Clock(true);
       scene = baseScene;
       requestAnimationFrame(render);
   }
   catch(e) { alert('WebGL failed'); }
});