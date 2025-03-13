import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import { Sky } from "three/examples/jsm/Addons.js";

/**
 * Base
 */
// Textures

const loadingScreen = document.getElementById('loading-screen');
const loadingManager = new THREE.LoadingManager(() => {
    console.log("is loaded")
    loadingScreen.style.display = 'none';
});

const textureLoader = new THREE.TextureLoader(loadingManager);

//Floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorArmTexture = textureLoader.load(
    "./floor/brown_mud_leaves_01_arm_1k.jpg"
);
const floorDiffTexture = textureLoader.load(
    "./floor/brown_mud_leaves_01_diff_1k.jpg"
);
floorDiffTexture.colorSpace = THREE.SRGBColorSpace;
const floorDispTexture = textureLoader.load(
    "./floor/brown_mud_leaves_01_disp_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
    "./floor/brown_mud_leaves_01_nor_dx_1k.jpg"
);

//Wall
const wallArmTexture = textureLoader.load("./wall/brick_wall_001_arm_1k.jpg");
const wallDiffTexture = textureLoader.load(
    "./wall/brick_wall_001_diffuse_1k.jpg"
);
wallDiffTexture.colorSpace = THREE.SRGBColorSpace;
const wallNormalTexture = textureLoader.load(
    "./wall/brick_wall_001_nor_dx_1k.jpg"
);

//Roof
const roofArmTexture = textureLoader.load(
    "./roof/roof_tiles_14_arm_1k.jpg"
);
const roofDiffTexture = textureLoader.load(
    "./roof/roof_tiles_14_diff_1k.jpg"
);
roofDiffTexture.colorSpace = THREE.SRGBColorSpace;
const roofDispTexture = textureLoader.load(
    "./roof/roof_tiles_14_disp_1k.jpg"
);
const roofNormalTexture = textureLoader.load(
    "./roof/roof_tiles_14_nor_dx_1k.jpg"
);
//Graves
const graveArmTexture = textureLoader.load(
    "./grave/concrete_wall_006_arm_1k.jpg"
);
const graveDiffTexture = textureLoader.load(
    "./grave/concrete_wall_006_diff_1k.jpg"
);
graveDiffTexture.colorSpace = THREE.SRGBColorSpace;
const graveNormalTexture = textureLoader.load(
    "./grave/concrete_wall_006_nor_dx_1k.jpg"
);
// Bushes

const bushArmTexture = textureLoader.load(
    "./bush/sparse_grass_arm_1k.jpg"
);
const bushDiffTexture = textureLoader.load(
    "./bush/sparse_grass_diff_1k.jpg"
);
bushDiffTexture.colorSpace = THREE.SRGBColorSpace;
const bushDispTexture = textureLoader.load(
    "./bush/sparse_grass_disp_1k.jpg"
);
const bushNormalTexture = textureLoader.load(
    "./bush/sparse_grass_nor_dx_1k.jpg"
);

// Door

const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const sky = new Sky()
scene.add(sky)
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)
sky.scale.set(50, 50, 50)

scene.fog = new THREE.FogExp2('#04343f', 0.1)
/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

// Walls

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallDiffTexture,
        aoMap: wallArmTexture,
        roughnessMap: wallArmTexture,
        metalnessMap: wallArmTexture,
        normalMap: wallNormalTexture,
    })
);
walls.position.y += 1.25;
house.add(walls);

// Roof

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4, 100),
    new THREE.MeshStandardMaterial({
        map: roofDiffTexture,
        aoMap: roofArmTexture,
        roughnessMap: roofArmTexture,
        metalnessMap: roofArmTexture,
        normalMap: roofNormalTexture,
        displacementMap: roofDispTexture,
        displacementScale: 0.15,
        displacementBias: -0.1,
    })
);

roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
    })
);
door.position.z = 2.01;
door.position.y = 1;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 64, 64);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushDiffTexture,
    aoMap: bushArmTexture,
    roughnessMap: bushArmTexture,
    metalnessMap: bushArmTexture,
    normalMap: bushNormalTexture,
    displacementMap: bushDispTexture,
    displacementScale: 0.5,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.3, 0.3, 0.3);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-1.9, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.6, 0.6, 0.6);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2, 100, 100);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveDiffTexture,
    aoMap: graveArmTexture,
    roughnessMap: graveArmTexture,
    metalnessMap: graveArmTexture,
    normalMap: graveNormalTexture,
});

graveDiffTexture.repeat.set(0.3, 0.4)
graveArmTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

const graves = new THREE.Group();
for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.sin(angle) * radius;
    const y = Math.random() * 0.4;
    const z = Math.cos(angle) * radius;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.x = x;
    grave.position.y = y;
    grave.position.z = z;
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true
    grave.receiveShadow = true
    graves.add(grave);
}
scene.add(graves);
//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorDiffTexture,
        aoMap: floorArmTexture,
        roughnessMap: floorArmTexture,
        metalnessMap: floorArmTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDispTexture,
        displacementScale: 0.3,
        displacementBias: -0.2,
    })
);
floor.rotation.x = -Math.PI / 2;

scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1.5);
directionalLight.position.set(3, 2, -8);
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20
scene.add(directionalLight);
// Door light
const doorLight = new THREE.PointLight('#ff7d46', 10)
doorLight.position.set(0, 2.2, 2.5)
scene.add(doorLight)
// Ghost
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);
camera.position.x = 3;
camera.position.y = 5;
camera.position.z = 9;
camera.lookAt(house)
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10
/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
    // Timer
    timer.update();
    const elapsedTime = timer.getElapsed();
    const ghost1Angle = elapsedTime / 2
    ghost1.position.x = 4 * Math.cos(ghost1Angle)
    ghost1.position.z = 4 * Math.sin(ghost1Angle)
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)
    const ghost2Angle = - elapsedTime / 3.3
    ghost1.position.x = 5 * Math.cos(ghost2Angle)
    ghost1.position.z = 5 * Math.sin(ghost2Angle)
    ghost1.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)
    const ghost3Angle = elapsedTime / 4.1
    ghost3.position.x = 6 * Math.cos(ghost3Angle)
    ghost3.position.z = 6 * Math.sin(ghost3Angle)
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)
    // Update controls
    controls.update();
    // Camera rotation
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
