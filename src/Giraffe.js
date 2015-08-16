import React         from 'react';
import THREE         from 'three';
import ColladaLoader from 'three-loaders-collada';
import getUserMedia  from 'getusermedia';
ColladaLoader(THREE);

/**
 * @module Giraffe
 * @extends React.Component
 * @author Adam Timberlake
 * @link
 */
class Giraffe extends React.Component {

    /**
     * @constructor
     * @return {Giraffe}
     */
    constructor() {

        super();

        getUserMedia({ audio: true, video: false }, (error, stream) => {

            console.log(stream);

        });

    }

    /**
     * @method render
     * @return {XML}
     */
    render() {
        return <p>Hello World</p>
    }

}

document.addEventListener('DOMContentLoaded', () => {
    React.render(<Giraffe />, document.querySelector('.scene'));
});









//
//    var aspectRatio = (innerWidth / innerHeight),
//        renderer    = new THREE.WebGLRenderer({ alpha: true, antialias: true }),
//        camera      = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000000),
//        scene       = new THREE.Scene();
//
//    scene.add(camera);
//    camera.position.z = 150;
//    renderer.setSize(innerWidth, innerHeight);
//    document.querySelector('.scene').appendChild(renderer.domElement);
//
//
//
//    // Render the ambient light so that even the darkest areas have a little bit
//    // of light cast on them.
//    scene.add(new THREE.AmbientLight(0x555555));
//
//    var light = new THREE.PointLight(0xFFFFFF);
//
//    light.intensity  = 1;
//    light.position.x = -100;
//    light.position.y = 50;
//    light.position.z = 100;
//    light.castShadow = true;
//
//    scene.add(light);
//
//
//    addGiraffe();
//    renderer.render(scene, camera);
//
//    setInterval(() => {
//        console.log('x');
//        renderer.render(scene, camera)}, 100);
//
//
//
//
//
//
//
//
//    function addGiraffe() {
//
//        const collada = new THREE.ColladaLoader();
//        //collada.options.convertUpAxis = true;
//
//        collada.load('models/giraffe.dae', result => {
//
//            result.scene.position.z = 47;
//            result.scene.position.x = 10;
//            result.scene.position.y = 10;
//
//            result.scene.rotation.x = -0.2;
//
//            result.scene.scale.x = 0.025;
//            result.scene.scale.y = 0.025;
//            result.scene.scale.z = 0.025;
//
//            scene.add(result.scene);
//
//
//
//            var material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0 }),
//                sphere   = new THREE.SphereGeometry(100, 1, 1);
//            var centerObject = new THREE.Mesh(sphere, material);
//
//            centerObject.rotation.x = 0.2;
//            centerObject.rotation.y = 0.2;
//
//            scene.add(centerObject);
//
//
//
//        });
//
//    }
//
//});