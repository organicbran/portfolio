import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

const scene = new THREE.Scene();
const container = document.getElementById("hero");
const camera = new THREE.PerspectiveCamera(15, container.clientWidth / container.clientHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setAnimationLoop(animate);
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);

// const effect = new OutlineEffect(renderer, {
//     defaultThickness: 0,
//     defaultColor: [ 0, 0, 0 ],
//     defaultAlpha: 1,
//     defaultKeepAlive: true
// });

const environment = new RoomEnvironment();
const pmremGenerator = new THREE.PMREMGenerator( renderer );

scene.environment = pmremGenerator.fromScene( environment ).texture;
scene.environmentIntensity = 0.8;

// const material = new THREE.MeshPhysicalMaterial({ color: 0x627fff, roughness: 1, metalness: 0 });
const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, wireframe: true });

let model;
const loader = new GLTFLoader();
loader.load( '/assets/handheld.glb', function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene.children[0];
    model.material.aoMapIntensity = 2;
    // model.material = material;
});

camera.position.z = 10;

let mouseX = 0;
let mouseY = 0;
window.addEventListener('pointermove', function () {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * -2 + 1;
});

const rotationSmooth = 8;
const rotationAngle = Math.PI / 4;

const clock = new THREE.Clock();
function animate() {
    let delta = clock.getDelta();
    if (model != null) {
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * rotationAngle, rotationSmooth * delta);
        model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, mouseY * -rotationAngle, rotationSmooth * delta);
    }
    renderer.render(scene, camera);
    // effect.render(scene, camera);
}

window.onscroll = function() { scroll() };
function scroll() {
    let switchPoint = window.scrollY + document.getElementById("panel-2").getBoundingClientRect().top - document.getElementById("bar-container").clientHeight;
    if (document.body.scrollTop > switchPoint || document.documentElement.scrollTop > switchPoint) {
        document.body.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--off-white');
        document.getElementById("bar-container").classList.add("light")
        var barlinks = document.getElementsByClassName("bar-link");
        for (var i = 0; i < barlinks.length; i++) {
            barlinks[i].classList.add("bar-link-light");
        }
    } else {
        document.body.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--blurple');
        document.getElementById("bar-container").classList.remove("light")
        var barlinks = document.getElementsByClassName("bar-link");
        for (var i = 0; i < barlinks.length; i++) {
            barlinks[i].classList.remove("bar-link-light");
        }
    }
}