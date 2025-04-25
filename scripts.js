import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0xccf3e0 });
const mesh = new THREE.Mesh(geometry, mat);

scene.add(mesh);

const sizes = {
    // 사용자 웹브라우저 크기 받아오기
    width: innerWidth,
    height: innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3
scene.add(camera)

const canvas = document.querySelector('canvas.myCanvas');

const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas
    })

const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

// 위치 변경경
// mesh.position.set(1.2, 2.5, -1.0)
// mesh.position.set(0.8, 2.5, 0.2)

// mesh.position.normalize()

// 회전
mesh.rotation.x = 45 * Math.PI / 180
mesh.rotation.y = 45 * Math.PI / 180
mesh.rotation.z = 45 * Math.PI / 180

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height);

let isDragging = false
let oldMousePos = { x: 0, y: 0 }

// 렌더링
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera);

// 이벤트
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
});

window.addEventListener('dblclick', () => {

    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElemnt

    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
    else {
        document.exitFullscreen()
    }
})

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    oldMousePos = { x: e.clientX, y: e.clientY }
})

renderer.domElement.addEventListener('mouseup', (e) => {
    isDragging = false;
})

renderer.domElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaMove = {
        x: e.clientX - oldMousePos.x,
        y: e.clientY - oldMousePos.y
    };

    const rotationSpeed = 0.0005;

    // 마우스 드래그에 따라 회전 적용
    mesh.rotation.y += deltaMove.x * rotationSpeed;
    mesh.rotation.x += deltaMove.y * rotationSpeed;

    oldMousePos = { x: e.clientX, y: e.clientY };
    renderer.render(scene, camera);
});