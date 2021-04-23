import * as THREE from 'three';
import { BaseRenderer } from './baseRenderer';
import * as seedrandom from 'seedrandom';
import gsap from 'gsap';
import vertShader from './shaders/vertShader.txt';
import fragShader from './shaders/fragShader.txt';
import bgVertShader from './shaders/bgVertShader.txt';
import bgFragShader from './shaders/bgFragShader.txt';
import glowVertShader from './shaders/glowVertShader.txt';
import glowFragShader from './shaders/glowFragShader.txt';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

const srandom = seedrandom('a');

let tl;

const BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
    exposure: 2,
    bloomStrength: 3,
    bloomThreshold: 0,
    bloomRadius: 1,
    scene: "Scene with Glow"
};

const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};

export default class ThreeRenderer implements BaseRenderer{
    canvas: HTMLCanvasElement;

    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    renderer: THREE.Renderer;
    group: THREE.Object3D;
    bg: THREE.Mesh;
    completeCallback: any;
    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;

    constructor(canvas: HTMLCanvasElement) {

        this.camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 10 );
        this.camera.position.z = 1;
    
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000010 );

        this.scene.add( new THREE.AmbientLight( 0x404040 ) );

        this.renderer = new THREE.WebGLRenderer( { 
            canvas: canvas, 
            antialias: true,
            preserveDrawingBuffer: true
        } );
        this.renderer.setSize( WIDTH, HEIGHT );

        const renderScene = new RenderPass( this.scene, this.camera );

        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;

        this.bloomComposer = new EffectComposer( this.renderer );
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass( renderScene );
        this.bloomComposer.addPass( bloomPass );

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: glowVertShader,
                fragmentShader: glowFragShader,
                defines: {}
            } ), "baseTexture"
        );
        finalPass.needsSwap = true;

        this.finalComposer = new EffectComposer( this.renderer );
        this.finalComposer.addPass( renderScene );
        this.finalComposer.addPass( finalPass );

        this.bloomComposer.setSize( WIDTH, HEIGHT );
        this.finalComposer.setSize( WIDTH, HEIGHT );


        // ADD ITEMS HERE

        let bgUniforms = {
            delta: {
                value: 0
            }
        };
        let bgGeometry = new THREE.PlaneGeometry(19, 10);
        let bgMaterial = new THREE.ShaderMaterial({
            uniforms: bgUniforms,
            vertexShader: bgVertShader, 
            fragmentShader: bgFragShader
        }); 
        this.bg = new THREE.Mesh( bgGeometry, bgMaterial );
        this.bg.position.set(0, 0, -6);
        this.scene.add(this.bg);


        this.group = new THREE.Object3D();
        
        let size = .2;

        for (let i = 0; i < 200; i++) {

            let x = -4 + (srandom() * 8);
            let z = -1 - srandom() * 5;
            let y = -5 + (srandom() * 4) * z;

            const color = new THREE.Color();
            color.setHSL( 0.1, 0.7, 0.3);

            let uniforms = {
                delta: {
                    value: 0
                }
            };

            const geometry = new THREE.CircleGeometry( size,  22);
            let material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertShader, 
                fragmentShader: fragShader,
                side: THREE.DoubleSide,
                transparent: true
            }); 
            let mesh = new THREE.Mesh( geometry, material );
            mesh.layers.enable( BLOOM_SCENE );

            //mesh.rotation.set(Math.PI * 0.2 , 0, 0);
            mesh.position.set(x, y, z);
            this.group.add(mesh);
        }

        this.scene.add( this.group );
    
        // END ADD ITEMS

        this.createTimeline();
    }

    private createTimeline() {
        
        tl = gsap.timeline({
            repeat: -1,
            onComplete: () => this.handleComplete(),
            onRepeat: () => this.handleRepeat()
        });

        
        tl.timeScale(3);

        for (let i = 0; i < this.group.children.length; i++) {
            let item = this.group.children[i];
            
            tl.to(item.position, {
                y: 5, 
                duration: 10,
                ease: 'none'
            }, 0);

            tl.to(item.position, {
                x: -5 + srandom() * 10, 
                duration: 5 + srandom() * 5,
                ease: 'power1.out'
            }, 0);

            tl.to(item.material.uniforms.delta, {
                value: 1, 
                duration: 10,
                ease: 'none'
            }, 0);
        }
        
        console.log('DURATION:', tl.duration());
        
    }

    private handleRepeat() {
        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    private handleComplete() {

    }

    public render() {
        //this.renderer.render(this.scene, this.camera);

        this.renderBloom();
        this.finalComposer.render();
    }

    public play() {
        tl.restart();
    }

    public stop() {
        tl.pause(true);
        tl.time(0);
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        
    }

    private renderBloom() {
        this.scene.traverse( this.darkenNonBloomed );
        this.bloomComposer.render();
        this.scene.traverse( this.restoreMaterial );
    }

    private darkenNonBloomed( obj ) {
        if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
            materials[ obj.uuid ] = obj.material;
            obj.material = darkMaterial;
        }
    }

    private restoreMaterial( obj ) {
        if ( materials[ obj.uuid ] ) {
            obj.material = materials[ obj.uuid ];
            delete materials[ obj.uuid ];
        }
    }
}