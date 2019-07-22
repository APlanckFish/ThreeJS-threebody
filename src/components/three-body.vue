<template>
  <div>
    <div ref="demo1" id="WebGL-output"></div>
    <div class="btnGroup">
      <div class="btn" @click="loadAnimation(1)">特解一</div>
      <div class="btn2" @click="loadAnimation(2)">特解二</div>
      <div class="btn3" @click="loadAnimation(3)">地月日运动</div>
      <div @click="resetPosition" class="btn4">复位</div>
    </div>
    <img src="../assets/logo.png" class="logo" @click="fullScreen"/>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts';
import dat from 'dat.gui'
export default {
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      orbit: null,
      cubeCamera: null,
      spotLight: null,
      cube: null,
      cube2: null,
      cube3: null,
      //特解一 旋转角度
      angel: -Math.PI/2,
      trans: false,
      angel2: 0,
      trans2: false,
      angel3: -Math.PI,
      trans3: false,
      //特解二 旋转角度
      angel4: Math.PI,
      earthRot: 0,
      moonRot: 0,
      //重置
      reset: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      window.addEventListener('resize', this.onResize, false);
      this.initMesh()
    },
    initMesh () {
      //创建场景
      this.scene = new THREE.Scene();
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
      this.orbit = new OrbitControls(this.camera);
      // 创建render函数
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000, 1.0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      
      let textureCube = this.createCubeMap();
      textureCube.format = THREE.RGBFormat;
      let shader = THREE.ShaderLib["cube"];
      shader.uniforms["tCube"].value = textureCube;
      //创建阴影材质
      let material = new THREE.ShaderMaterial({
          fragmentShader: shader.fragmentShader,
          vertexShader: shader.vertexShader,
          uniforms: shader.uniforms,
          depthWrite: false,
          side: THREE.DoubleSide
      });
      //创建天空盒
      let skybox = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), material);
      this.scene.add(skybox);

      this.camera.position.x = 0;
      this.camera.position.y = 5;
      this.camera.position.z = 33;
      this.camera.lookAt(this.scene.position);

      this.cubeCamera = new THREE.CubeCamera(0.1, 20000, 256);
      this.scene.add(this.cubeCamera);
      //定义cube材质
      // let dynamicEnvMaterial = new THREE.MeshBasicMaterial({envMap: this.cubeCamera.renderTarget, side: THREE.DoubleSide});
      let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
      let sphereMaterial = new THREE.MeshBasicMaterial({envMap: this.cubeCamera.renderTarget, side: THREE.DoubleSide});
      this.cube = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(this.cube);

      //创建第二个第三个
      this.cube2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.cube3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
      this.scene.add(this.cube2);
      this.scene.add(this.cube3);

      //定义光源
      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);
      this.spotLight = spotLight;

      this.$refs.demo1.append(this.renderer.domElement)
      this.render()
    },
    render () {
      this.orbit.update();
      // this.cube.rotation.x += 0.02;
      // this.cube.rotation.y += 0.02;
      // this.cube.rotation.z += 0.02;
      this.cubeCamera.updateCubeMap(this.renderer, this.scene);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render);
    },
    /** 慢速星空 - 创建star纹理 **/
    // makeStarTexture(){
    //     const canvas = document.createElement('canvas');
    //     canvas.width = 16;
    //     canvas.height = 16;
    //     const pen = canvas.getContext('2d');
    //     const gradient = pen.createRadialGradient(
    //         canvas.width/2,canvas.height/2,0,canvas.width/2,canvas.height/2,canvas.width/2
    //     );//创建放射状渐变
    //     gradient.addColorStop(0,'rgba(255,255,255,1)');
    //     gradient.addColorStop(0.2,'rgba(0,255,255,1)');
    //     gradient.addColorStop(0.4,'rgba(0,0,164,1)');
    //     gradient.addColorStop(1,'rgba(0,0,0,1)');
    //     pen.fillStyle = gradient;						//将笔触填充色设置为这个渐变放射状
    //     pen.fillRect(0,0,canvas.width,canvas.height);	//画矩形
    //     const texture = new THREE.Texture(canvas);		//生成贴图对象（参数是图片或canvas画布）
    //     texture.needsUpdate = true;						//将这个对象缓存到GPU
    //     return texture;
    // },
    createCubeMap () {
      let path = "static/";
      // let path = '../assets/'
      let format = '.jpg';
      let urls = [
          path + 'posx' + format, path + 'negx' + format,
          path + 'posy' + format, path + 'negy' + format,
          path + 'posz' + format, path + 'negz' + format
      ];
      // debugger
      let textureCube = THREE.ImageUtils.loadTextureCube(urls);
      // debugger
      return textureCube;
    },
    loadAnimation (val) {
      if(val==1){
        this.loadAnimation2();
        document.querySelector('.btn').style.display='none';
        document.querySelector('.btn2').style.display='none';
        document.querySelector('.btn3').style.display='none';
      }else if(val==2){
        this.loadAnimation4();
        document.querySelector('.btn').style.display='none';
        document.querySelector('.btn2').style.display='none';
        document.querySelector('.btn3').style.display='none';
      }else if(val==3){
        document.querySelector('.btn').style.display='none';
        document.querySelector('.btn2').style.display='none';
        document.querySelector('.btn3').style.display='none';
        document.querySelector('.btn4').style.display='none';
        this.initSolarSystem();
      }
    },
    //
    loadAnimation2 () {
      //  变成三体 特解1
      if(this.cube2.position.x<=20){
        this.cube2.position.x+=0.1
        this.cube2.position.z+=0.1
      }
      if(this.cube3.position.x>=-20){
        this.cube3.position.x-=0.1
        this.cube3.position.z-=0.1
      }
      this.camera.position.z+=0.1
      this.camera.position.y+=0.1
      this.cubeCamera.updateCubeMap(this.renderer, this.scene);
      // sphere.visible = true;
      this.renderer.render(this.scene, this.camera);
      if(this.cube2.position.x>20&&this.cube3.position.x<-20){
        cancelAnimationFrame(this.loadAnimation2);
        this.loadAnimation3();
        
      }else{
        if(!this.reset){
          requestAnimationFrame(this.loadAnimation2);
        }else{
          this.resetAnimation()
        }
      }
    },
    loadAnimation3 () {
      // 模拟8字轨道运动 特解1
      //cube运动轨迹
      if(!this.trans){
        this.angel+=0.01;
        this.cube.position.x = 20*(Math.sin(this.angel)+1);
      }else{
        this.angel-=0.01;
        this.cube.position.x = 20*(Math.sin(this.angel)-1);
      }
      this.cube.position.z = 20*Math.cos(this.angel);
      if(this.angel>=Math.PI*3/2){
        this.angel=-3/2*Math.PI
        this.trans=!this.trans
      }
      if(this.angel<=-7/2*Math.PI){
        this.angel=-1/2*Math.PI
        this.trans=!this.trans
      }
      //cube2运动轨迹
      if(!this.trans2){
        this.angel2+=0.01;
        this.cube2.position.x = 20*(Math.sin(this.angel2)+1);
      }else{
        this.angel2-=0.01;
        this.cube2.position.x = 20*(Math.sin(this.angel2)-1);
      }
      this.cube2.position.z = 20*Math.cos(this.angel2);
      console.log(this.cube2.position.x,'xxxxxxxx')
      if(this.angel2>=Math.PI*3/2){
        this.angel2=-3/2*Math.PI
        this.trans2=!this.trans2
      }
      if(this.angel2<=-7/2*Math.PI){
        this.angel2=-1/2*Math.PI
        this.trans2=!this.trans2
      }
      //cube3运动轨迹
      if(!this.trans3){
        this.angel3-=0.01;
        this.cube3.position.x = 20*(Math.sin(this.angel3)-1);
      }else{
        this.angel3+=0.01;
        this.cube3.position.x = 20*(Math.sin(this.angel3)+1);
      }
      this.cube3.position.z = 20*Math.cos(this.angel3);
      if(this.angel3>=Math.PI*3/2){
        this.angel3=Math.PI/2
        this.trans3=!this.trans3;
      }
      if(this.angel3<=-Math.PI*3/2){
        this.angel3=-Math.PI/2
        this.trans3=!this.trans3
      }
      // this.cubeCamera.updateCubeMap(this.renderer, this.scene);
      this.renderer.render(this.scene, this.camera);
      if(!this.reset){
        requestAnimationFrame(this.loadAnimation3);
      }else{
        cancelAnimationFrame(this.loadAnimation3);
        this.resetAnimation()
      }
    },
    loadAnimation4 () {
      //特解二 等边三角
      if(this.cube2.position.x<=10*Math.sqrt(3)){
        this.cube2.position.x+=0.1
        // this.cube2.position.z+=0.1
      }
      if(this.cube3.position.x>=-10*Math.sqrt(3)){
        this.cube3.position.x-=0.1
        // this.cube3.position.z-=0.1
      }
      if(this.cube2.position.x>10*Math.sqrt(3)&&this.cube2.position.z<=10){
        this.cube2.position.z+=0.1
      }
      if(this.cube3.position.x<=-10*Math.sqrt(3)&&this.cube3.position.z<=10){
        this.cube3.position.z+=0.1
      }
      if(this.cube2.position.x>10*Math.sqrt(3)&&this.cube3.position.x<=-10*Math.sqrt(3)&&this.cube.position.z>=-20){
        this.cube.position.z-=0.1
      }
      this.camera.position.z+=0.05
      this.camera.position.y+=0.1
      this.cubeCamera.updateCubeMap(this.renderer, this.scene);
      // sphere.visible = true;
      this.renderer.render(this.scene, this.camera);
      if(this.cube.position.z<-20){
        cancelAnimationFrame(this.loadAnimation4);
        // console.log(this.cube.position,'position')
        this.loadAnimation5()
      }else{
        if(!this.reset){
          requestAnimationFrame(this.loadAnimation4);
        }else{
          this.resetAnimation()
        }
      }
      // requestAnimationFrame(this.loadAnimation4);
    },
    loadAnimation5 () {
      // 围绕(0,0,0)旋转
      this.angel4+=0.01;
      this.cube.position.x=Math.sin(this.angel4)*20;
      this.cube.position.z=Math.cos(this.angel4)*20;
      this.cube2.position.x=Math.sin(this.angel4-Math.PI*2/3)*20;
      this.cube2.position.z=Math.cos(this.angel4-Math.PI*2/3)*20;
      this.cube3.position.x=Math.sin(this.angel4+Math.PI*2/3)*20;
      this.cube3.position.z=Math.cos(this.angel4+Math.PI*2/3)*20;
      this.renderer.render(this.scene, this.camera);
      if(!this.reset){
        requestAnimationFrame(this.loadAnimation5);
      }else{
        this.resetAnimation()
      }
    },
    initSolarSystem () {
      this.scene.remove(this.cube);
      this.scene.remove(this.cube2);
      this.scene.remove(this.cube3);
      this.scene.remove(this.spotLight);
      //太阳
      let sun = new THREE.SphereGeometry( 500, 64, 64 );
      let mesh = new THREE.MeshBasicMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture('static/sun.jpg') } );
      this.cube = new THREE.Mesh( sun, mesh );
      // this.cube.position.x=0;
      // this.cube.position.y=0;
      // this.cube.position.z=0;
      this.scene.add(this.cube);
      //太阳光源
      let light = new THREE.PointLight(0xffffff,1,0,0);
      light.position.set(0,0,0);
      this.scene.add( light );
      this.spotLight = light;

      //地球
      let earth = new THREE.SphereGeometry( 280, 64, 64 );
      let mesh2 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture('static/earth.jpg') } );
      this.cube2 = new THREE.Mesh( earth, mesh2 );
      this.scene.add(this.cube2);

      //月球
      let moon = new THREE.SphereGeometry( 60, 64, 64 );
      let mesh3 = new THREE.MeshPhongMaterial( { color: 0xffffff, map: THREE.ImageUtils.loadTexture('static/moon.jpg') } );
      this.cube3 = new THREE.Mesh( moon, mesh3 );
      this.scene.add(this.cube3);
      // this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10);
      // this.camera.lookAt({x:0, y:0, z:0 });
      this.camera.position.x=3000;
      this.camera.position.y=1000;
      this.camera.position.z=1000;
      this.rotateSolarSystem();
      // this.renderer.render(this.scene, this.camera);
      // requestAnimationFrame(this.initSolarSystem);
    },
    rotateSolarSystem () {
      //地球运动
      this.earthRot+=0.01;
      this.cube2.position.x = Math.sin(this.earthRot)*3800;
      this.cube2.position.z = Math.cos(this.earthRot)*3800;
      this.cube2.rotation.x = -Math.PI*(1/8); 
      this.cube2.rotation.y += 0.008; 
      //月球运动
      this.moonRot+=0.1;
      this.cube3.position.x=Math.sin(this.moonRot)*500 + this.cube2.position.x;
      this.cube3.position.z = Math.cos(this.moonRot)*500 + this.cube2.position.z;
      this.cube3.rotation.y += 0.001;
      this.renderer.render(this.scene,this.camera);
      requestAnimationFrame(this.rotateSolarSystem);
    },
    resetPosition () {
      //复位cube及camera
      // debugger
      if(this.cube.position.x==0&&this.cube2.position.x==0&&this.cube3.position.x==0){
        //
      }else{
        this.reset=true
      }
    },
    resetAnimation () {
      this.cube.position.x=0;
      this.cube.position.y=0;
      this.cube.position.z=0;
      this.cube2.position.x=0;
      this.cube2.position.y=0;
      this.cube2.position.z=0;
      this.cube3.position.x=0;
      this.cube3.position.y=0;
      this.cube3.position.z=0;
      this.camera.position.x = 0;
      this.camera.position.y = 5;
      this.camera.position.z = 33;
      this.camera.lookAt(this.scene.position);
      this.reset=false
      document.querySelector('.btn').style.display='block'
      document.querySelector('.btn2').style.display='block'
      document.querySelector('.btn3').style.display='block'
      document.querySelector('.btn4').style.display='block'
    },
    fullScreen () {
      // debugger
      let body = document.body;
      if(body){
        body.requestFullscreen();
      }
    },
    onResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

}
</script>

<style scoped>
.btnGroup{
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  text-align: center;
}
.btn{
  /* position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  width: 100px; */
  text-align: center;
  border: 1px solid transparent;
  /* width: 50px; */
  /* display: inline-block; */
  color: #cccccc;
  background: #000000;
  cursor: pointer;
  transition: all 0.5s ease-out;
}
.btn:hover{
  border: 1px solid #00ff00
}
.btn2{
  text-align: center;
  border: 1px solid transparent;
  /* display: inline-block; */
  color: #cccccc;
  background: #000000;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.5s ease-out;
}
.btn2:hover{
  border: 1px solid #00ff00
}
.btn3{
  text-align: center;
  border: 1px solid transparent;
  color: #cccccc;
  background: #000000;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.5s ease-out;
}
.btn3:hover{
  border: 1px solid #00ff00
}
.btn4{
  text-align: center;
  border: 1px solid transparent;
  color: #cccccc;
  background: #000000;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.5s ease-out;
}
.btn4:hover{
  border: 1px solid #00ff00;
}
.logo{
  position: fixed;
  left: 20px;
  top: 20px;
  cursor: pointer;
}
</style>