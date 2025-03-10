import * as THREE from 'three'
export function getPoints(lx) {
  const points = []
  for (let i = 0; i < lx.geometry.attributes.position.count; i++) {
    points.push(new THREE.Vector3(
      lx.geometry.attributes.position.getX(i),
      lx.geometry.attributes.position.getY(i),
      lx.geometry.attributes.position.getZ(i),
    ))
  }

  // 轨迹
  const curve = new THREE.CatmullRomCurve3(points)
  return curve.getPoints(500)
}