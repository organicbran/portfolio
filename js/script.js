import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

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

const effect = new OutlineEffect(renderer, {
    defaultThickness: 0,
    defaultColor: [ 0, 0, 0 ],
    defaultAlpha: 1,
    defaultKeepAlive: true
});

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, 1, 2);
//scene.add(light);

const fill = new THREE.AmbientLight(0xffffff, 1.25);
//scene.add(fill);

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    '/assets/env/px.png',
    '/assets/env/nx.png',
    '/assets/env/py.png',
    '/assets/env/ny.png',
    '/assets/env/pz.png',
    '/assets/env/nz.png'
]);
scene.environment = environmentMap;
scene.environmentRotation = new THREE.Euler(Math.PI, Math.PI * 1.5);
scene.environmentIntensity = 2;

// const environment = new RoomEnvironment();
// const pmremGenerator = new THREE.PMREMGenerator( renderer );

// scene.environment = pmremGenerator.fromScene( environment ).texture;
// scene.environment = pmremGenerator.fromEquirectangular( "assets/studio.hdr" );
// scene.environmentRotation = new THREE.Euler(0, Math.PI * 0.1, 0);
// scene.environmentIntensity = 1;

const geometry = new THREE.BoxGeometry(1, 1, 0.25);
//const geometry = new THREE.SphereGeometry(0.5, 24, 12);
//const aoTexture = textureLoader.load("/assets/ao.png")
const material = new THREE.MeshPhysicalMaterial({ color: 0x7a87ff, roughness: 1, metalness: 0 });
//material.aoMap = aoTexture;
//const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, wireframe: true });
//const model = new THREE.Mesh(geometry, material);
//scene.add(model);

let model;
const loader = new GLTFLoader();
loader.load( '/assets/handheld.glb', function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene.children[0];
    model.material.aoMapIntensity = 2;
    model.material.roughness = 1;
    model.material.metalness = 0;
});

camera.position.z = 10;

let mouseX = 0;
let mouseY = 0;
window.addEventListener('pointermove', function () {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * -2 + 1;
});

const rotationSmooth = 0.1;
const rotationAngle = 0.5;

function animate() {
    if (model != null) {
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, mouseX * rotationAngle, rotationSmooth);
        model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, mouseY * -rotationAngle, rotationSmooth);
    }
    effect.render(scene, camera);
}

window.onscroll = function() {scroll()};
function scroll() {
    let switchPoint = window.scrollY + document.getElementById("panel-2").getBoundingClientRect().top - document.getElementById("bar-container").clientHeight;
    if (document.body.scrollTop > switchPoint || document.documentElement.scrollTop > switchPoint) {
        document.body.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--off-white');
        document.getElementById("bar-container").classList.add("light")
        var barlinks = document.getElementsByClassName("bar-link");
        for (var i = 0; i < barlinks.length; i++) {
            barlinks[i].classList.add("bar-link-light");
        }
        var barlinkbuttons = document.getElementsByClassName("bar-link-button");
        for (var i = 0; i < barlinkbuttons.length; i++) {
            barlinkbuttons[i].classList.add("bar-link-button-light");
        }
    } else {
        document.body.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--blurple');
        document.getElementById("bar-container").classList.remove("light")
        var barlinks = document.getElementsByClassName("bar-link");
        for (var i = 0; i < barlinks.length; i++) {
            barlinks[i].classList.remove("bar-link-light");
        }
        var barlinkbuttons = document.getElementsByClassName("bar-link-button");
        for (var i = 0; i < barlinkbuttons.length; i++) {
            barlinkbuttons[i].classList.remove("bar-link-button-light");
        }
    }
}