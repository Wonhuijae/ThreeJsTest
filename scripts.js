import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let eternalRotate = false;

const scene = new THREE.Scene();

const color = 0xFFFFFF;
const intensity = 5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const sizes = {
    // 사용자 웹브라우저 크기 받아오기
    width: innerWidth,
    height: innerHeight
}

// 카메라
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, -5)
scene.add(camera)

// glb 불러오기
let loader = new GLTFLoader();

let charMesh;
let rotateSpeed = 0.05

loader.load(
    'NONG.glb',
    gltf => {
        charMesh = gltf.scene.children[0]
        charMesh.scale.set(0.5, 0.5, 0.5);
        charMesh.rotation.y = -180 * Math.PI / 180;
        scene.add(charMesh);
        camera.lookAt(charMesh.position)
        controls.target.copy(charMesh.position);
        charMesh.castShadow = true
    }
)


const canvas = document.querySelector('canvas.myCanvas');

const renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        // alpha: true,
        antialias: true
    }
)

renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;

const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 2;
controls.enableRotate = true;
controls.panSpeed = 1.5;     // 팬 속도
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.1


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
    console.log("resize")
 });

// window.addEventListener('dblclick', () => {

//     const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElemnt

//     if (!document.fullscreenElement) {
//         canvas.requestFullscreen()
//     }
//     else {
//         document.exitFullscreen()
//     }
// })

document.getElementById("eternalRotateButton").addEventListener('click', btnClick);

function btnClick() {
    eternalRotate = !eternalRotate;
}

function animate() {
    requestAnimationFrame(animate);

    if (eternalRotate) {
        // charMesh.rotation.x += rotateSpeed;
        charMesh.rotation.y += rotateSpeed;

        // 회전 값 제한 (회전 범위를 -PI ~ PI로 제한)
        if (charMesh.rotation.x > Math.PI) charMesh.rotation.x -= 2 * Math.PI;
        if (charMesh.rotation.x < -Math.PI) charMesh.rotation.x += 2 * Math.PI;

        if (charMesh.rotation.y > Math.PI) charMesh.rotation.y -= 2 * Math.PI;
        if (charMesh.rotation.y < -Math.PI) charMesh.rotation.y += 2 * Math.PI;
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

// legacy
// renderer.domElement.addEventListener('mousedown', (e) => {
//     isDragging = true;
//     oldMousePos = { x: e.clientX, y: e.clientY }

//     lastTime = performance.now();
// })

// renderer.domElement.addEventListener('mouseup', (e) => {
//     if (!isDragging) return;

//     isDragging = false;

//     // 마우스 버튼을 떼는 시점의 속도를 계산하여 관성 시작
//     const currentTime = performance.now();
//     const deltaTime = currentTime - lastTime;

//     // 충분한 시간과 움직임이 있을 때만 속도 계산
//     if (deltaTime > 5 && (Math.abs(lastDeltaMove.x) > 1 || Math.abs(lastDeltaMove.y) > 1)) {
//         // 계수 조정으로 더 분명한 관성 효과
//         const velocityFactor = 0.2; // 관성 강도 조절
//         rotationVelocity.x = lastDeltaMove.y / deltaTime * velocityFactor;
//         rotationVelocity.y = lastDeltaMove.x / deltaTime * velocityFactor;

//         // 콘솔로 관성 시작 값 확인 (디버깅용)
//         // console.log("Starting inertia: ", rotationVelocity);
//     }
// })

// renderer.domElement.addEventListener('mousemove', (e) => {
//     if (!isDragging) return;

//     const currentTime = performance.now();
//     const deltaTime = currentTime - lastTime;

//     const deltaMove = {
//         x: e.clientX - oldMousePos.x,
//         y: e.clientY - oldMousePos.y
//     };

//     // 회전 속도 계산
//     const rotationSpeed = 0.0005;
//     mesh.rotation.y += deltaMove.x * rotationSpeed;
//     mesh.rotation.x += deltaMove.y * rotationSpeed;

//     // 마지막 이동 정보 저장 (속도가 될 값)
//     if (deltaTime > 0) {
//         lastDeltaMove = deltaMove;
//         lastTime = currentTime;
//     }

//     oldMousePos = { x: e.clientX, y: e.clientY };
// });
// let isDragging = false
// let oldMousePos = { x: 0, y: 0 }
// let rotationVelocity = { x: 0, y: 0 };
// let lastDeltaMove = { x: 0, y: 0 };
// let lastTime = 0;
// let dampingFactor = 0.005; // 감쇠 계수 (0~1 사이, 작을수록 빨리 멈춤)

// // 애니메이션 루프에 관성 효과 적용
// function animate() {
//     requestAnimationFrame(animate);

//     // 드래그 중이 아닐 때 관성 효과 적용
//     if (!isDragging && (Math.abs(rotationVelocity.x) > 0.0001 || Math.abs(rotationVelocity.y) > 0.0001)) {
//         mesh.rotation.x += rotationVelocity.x;
//         mesh.rotation.y += rotationVelocity.y;

//         // 감쇠 적용 (점점 느려지게)
//         rotationVelocity.x *= dampingFactor;
//         rotationVelocity.y *= dampingFactor;
//     }

//     renderer.render(scene, camera);
// }


// 렌더링
