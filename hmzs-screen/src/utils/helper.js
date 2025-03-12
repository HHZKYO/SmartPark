import gsap from "gsap";

// 摄像机补间动画移动
export function cameraMove(camera, controls, position, targetPosition) {
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1.0,
    onUpdate() {
      controls.target = targetPosition;
      controls.update();
    },
  });
}