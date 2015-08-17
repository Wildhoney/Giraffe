import React         from 'react';
import THREE         from 'three';
import ColladaLoader from 'three-loaders-collada';
import getUserMedia  from 'getusermedia';
import yaml          from 'js-yaml';

/**
 * @constant innerWidth
 * @type {Number}
 */
const innerWidth = window.innerWidth;

/**
 * @property innerHeight
 * @type {Number}
 */
const innerHeight = window.innerHeight;

/**
 * @module Giraffe
 * @extends React.Component
 * @author Adam Timberlake
 * @link https://github.com/Wildhoney/Giraffe
 */
class Giraffe extends React.Component {

    /**
     * @property defaultProps
     * @type {Object}
     */
    static defaultProps = { scene: {} };

    /**
     * @property appendElement
     * @type {String}
     */
    static appendElement = '.scene';

    /**
     * @constructor
     * @return {Giraffe}
     */
    constructor() {

        super();

        ColladaLoader(THREE);

        fetch('scene.yml').then(response => new Promise(resolve => {
            response.text().then(text => resolve(yaml.safeLoad(text)));
        })).then(options => {
            this.options = options;
            this.addScene();
        });

        //getUserMedia({ audio: true, video: false }, (error, stream) => {
        //    console.log(stream);
        //});

    }

    /**
     * @method addScene
     * @return {void}
     */
    addScene() {

        const options       = this.options.scene;
        this.props.renderer = new THREE.WebGLRenderer({ alpha: options.alpha, antialias: options.anti_alias });
        this.props.scene    = new THREE.Scene();
        this.props.camera   = this.addCamera();

        this.addLights();
        this.addGiraffe();



        //var sphereMaterial =
        //    new THREE.MeshLambertMaterial(
        //        {
        //            color: 0xCC0000
        //        });
        //
        //var radius = 50,
        //    segments = 16,
        //    rings = 16;
        //
        //var sphere = new THREE.Mesh(
        //
        //    new THREE.SphereGeometry(
        //        radius,
        //        segments,
        //        rings),
        //
        //    sphereMaterial);
        //
        //this.props.scene.add(sphere);




        document.querySelector(Giraffe.appendElement).appendChild(this.props.renderer.domElement);
        this.renderScene();

    }

    /**
     * @method renderScene
     * @return {void}
     */
    renderScene() {

        const camera = this.props.camera;

        const render = () => {

            this.props.renderer.render(this.props.scene, this.props.camera);
            requestAnimationFrame(render);

        };

        render();

    }

    /**
     * @method addCamera
     * @return {THREE.PerspectiveCamera}
     */
    addCamera() {

        const options = this.options.scene;
        const aspect  = (innerWidth / innerHeight);
        const camera  = new THREE.PerspectiveCamera(options.angle, aspect, options.near, options.far);

        this.props.scene.add(camera);
        camera.position.z = 100;
        this.props.renderer.setSize(innerWidth, innerHeight);

        return camera;

    }

    /**
     * @method addLights
     * @return {Object}
     */
    addLights() {

        const ambientLight = new THREE.AmbientLight(0x555555);
        const pointLight   = new THREE.PointLight(0xFFFFFF);

        pointLight.intensity  = 1;
        pointLight.position.x = -1000;
        pointLight.position.y = 50;
        pointLight.position.z = -100;
        pointLight.castShadow = true;

        this.props.scene.add(ambientLight);
        this.props.scene.add(pointLight);

        return { ambientLight, pointLight };

    }

    /**
     * @method addGiraffe
     * @return {Promise}
     */
    addGiraffe() {

        const loader = new THREE.ColladaLoader();

        return new Promise(resolve => {

            loader.load('models/Giraffe.dae', result => {

                //var material = new THREE.MeshLambertMaterial( { color: 0x990000 } );
                //
                //result.scene.traverse(child => {
                //
                //    if (child instanceof THREE.Mesh) {
                //        child.material = material;
                //
                //    }
                //
                //});

                result.scene.scale.x = result.scene.scale.y = result.scene.scale.z = 2;
                result.scene.updateMatrix();

                this.props.scene.add(result.scene);
                resolve(result.scene);

            });

        });

    }

    /**
     * @method render
     * @return {XML}
     */
    render() {

        return (
            <section className="scene"></section>
        );

    }

}

document.addEventListener('DOMContentLoaded', () => {
    React.render(<Giraffe />, document.body);
});
