import {Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, Points, BufferGeometry,
  PointsMaterial, TextureLoader, BufferAttribute } from 'three';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  @HostListener('window:resize')

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  scene = new Scene();
  camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  renderer!: WebGLRenderer;
  stars!: Points;
  animationId!: number;
  starPositions!: Float32Array;
  starGeometry!: BufferGeometry;

  constructor() {
    this.camera.position.z = 1;
    this.camera.rotation.x = Math.PI / 2;
  }

  ngOnInit(): void {
    this.initScene();
  }

  ngAfterViewInit(): void {
    this.initRenderer();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }

  private initScene(): void {
    // Create star geometry with positions
    this.starGeometry = new BufferGeometry();
    const positions = new Float32Array(6000 * 3); // 6000 stars, 3 coordinates each

    for (let i = 0; i < 6000; i++) {
      const i3 = i * 3;
      positions[i3] = Math.random() * 600 - 300;     // x
      positions[i3 + 1] = Math.random() * 600 - 300; // y
      positions[i3 + 2] = Math.random() * 600 - 300; // z
    }

    this.starGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.starPositions = positions; // Store reference for animation

    const sprite = new TextureLoader().load('assets/star.png');
    const starMaterial = new PointsMaterial({
      color: 0xaaaaaa,
      size: 0.7,
      map: sprite,
    });

    this.stars = new Points(this.starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private initRenderer(): void {
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Update star positions (move them forward)
    const positions = this.starPositions;
    for (let i = 0; i < positions.length; i += 3) {
      // Move each star forward (negative Z direction in Three.js)
      positions[i + 1] -= 0.5; // Adjust speed as needed

      // If star moves past camera, reset it to the back
      if (positions[i + 1] < -300) {
        positions[i + 1] = 300;
        // Optional: Randomize x and y when resetting
        positions[i] = Math.random() * 600 - 300;
        positions[i + 2] = Math.random() * 600 - 300;
      }
    }

    // Mark the position attribute as needing update
    this.starGeometry.attributes['position'].needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
