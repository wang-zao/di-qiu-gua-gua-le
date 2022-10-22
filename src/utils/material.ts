import * as THREE from 'three';

export const normalMaterial = new THREE.MeshPhongMaterial({
  shininess: 5,
  color: '#666666',
  specular: '#888888',
  reflectivity: 0.5,
  flatShading: true,
  transparent: true,
  opacity: 1,
});
