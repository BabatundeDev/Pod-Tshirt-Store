import { LitElement, html, css } from "lit";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class TshirtViewer extends LitElement {
  static properties = {
    imageUrl: { type: String },
    printText: { type: String },
    productType: { type: String },
    height: { type: Number },
    weight: { type: Number },
    build: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      text-align: center;
    }

    #canvas-container {
      margin: auto;
      width: 400px;
      height: 400px;
    }

    canvas {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      border-radius: 12px;
    }
  `;

  constructor() {
    super();
    this.imageUrl = "";
    this.printText = "";
    this.productType = "default"; // fallback
  }

  firstUpdated() {
    this.initThreeJS();
    if (this.productType) {
      this.loadModel(this.productType);
    }
  }

  updated(changed) {
    if (changed.has("imageUrl") || changed.has("printText")) {
      this.updateShirtTexture();
    }

    if (
      changed.has("height") ||
      changed.has("weight") ||
      changed.has("build")
    ) {
      this.updateModelScale();
    }

    if (changed.has("productType")) {
      this.loadModel(this.productType);
    }
  }

  initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(400, 400);
    this.shadowRoot
      .querySelector("#canvas-container")
      .appendChild(this.renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    this.scene.add(light);

    this.animate();
  }

  loadModel(productType) {
    const loader = new GLTFLoader();
    loader.load(
      `/models/${productType}.glb`,
      (gltf) => {
        if (this.shirt) {
          this.scene.remove(this.shirt);
        }

        this.shirt = gltf.scene;
        this.shirt.scale.set(1, 1, 1);
        this.scene.add(this.shirt);

        this.updateModelScale();
        this.updateShirtTexture();
      },
      undefined,
      (error) => {
        console.error("GLTF load failed:", error);
        // fallback to cube
        if (this.shirt) {
          this.scene.remove(this.shirt);
        }
        const geometry = new THREE.BoxGeometry(2, 2.5, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.shirt = new THREE.Mesh(geometry, material);
        this.scene.add(this.shirt);

        this.updateModelScale();
        this.updateShirtTexture();
      }
    );
  }

  updateModelScale() {
    if (!this.shirt) return;
    let scaleY = this.height ? this.height / 180 : 1;
    let scaleX = this.weight ? this.weight / 80 : 1;

    if (this.build === "lean") scaleX *= 0.9;
    if (this.build === "athletic") scaleX *= 1.1;
    if (this.build === "big") scaleX *= 1.2;

    this.shirt.scale.set(scaleX, scaleY, 1);
  }

  updateShirtTexture() {
    if (!this.shirt) return;

    let texture;
    if (this.imageUrl) {
      texture = new THREE.TextureLoader().load(this.imageUrl);
    } else if (this.printText) {
      texture = this.generateTextTexture(this.printText);
    }

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    this.shirt.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }

  generateTextTexture(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // black text
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.shirt) this.shirt.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return html` <div id="canvas-container"></div> `;
  }
}

customElements.define("tshirt-viewer", TshirtViewer);
