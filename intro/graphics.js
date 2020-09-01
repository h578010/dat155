class Graphics {
    constructor(can) {
        console.log("Got canvas" + can);
        let renderer = new THREE.WebGLRenderer();
        document.body.appendChild(renderer.domElement);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x202020, 1);
        let aspect = window.innerWidth/window.innerHeight;
        let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        let scene = new THREE.Scene();
        
        let geometry = new THREE.BoxGeometry();
        let material = new THREE.MeshLambertMaterial( { color: 0xff1694} );
        let light = new THREE.DirectionalLight(0xffffff);
        light.position.z = 1;
        let ambLight = new THREE.AmbientLight(0xffffff, 0.4);
        let cube = new THREE.Mesh(geometry, material);
        cube.rotation.x = 1.9;
        scene.add(cube);
        scene.add(light);
        scene.add(ambLight);
        camera.position.z = 4;

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            cube.rotation.x += 0.01;
            cube.rotation.z += 0.01;
        }
        animate();

    }
}

export default Graphics;