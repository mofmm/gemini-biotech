import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  Eye, 
  RotateCcw, 
  Sun, 
  Layers, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Dna, 
  ShieldAlert, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';
import { CompoundRecord } from '../utils/dataPreparation';

interface Atom3D {
  element: 'C' | 'N' | 'O' | 'F' | 'Cl' | 'S' | 'H';
  pos: [number, number, number];
  name?: string;
  isMacrocycleRing?: boolean;
}

interface Bond3D {
  from: number;
  to: number;
  order: 1 | 2;
  isMacrocycleRing?: boolean;
}

interface Conformer3D {
  name: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  description: string;
}

// Element standard CPK colors and covalent radii
const ELEMENT_PROPS: Record<string, { color: number; radius: number; pbrRoughness: number; pbrMetalness: number }> = {
  C: { color: 0x334155, radius: 0.38, pbrRoughness: 0.25, pbrMetalness: 0.1 },
  N: { color: 0x2563eb, radius: 0.36, pbrRoughness: 0.2, pbrMetalness: 0.15 },
  O: { color: 0xdc2626, radius: 0.35, pbrRoughness: 0.18, pbrMetalness: 0.1 },
  F: { color: 0x059669, radius: 0.33, pbrRoughness: 0.22, pbrMetalness: 0.1 },
  Cl: { color: 0x16a34a, radius: 0.44, pbrRoughness: 0.25, pbrMetalness: 0.1 },
  S: { color: 0xd97706, radius: 0.45, pbrRoughness: 0.3, pbrMetalness: 0.2 },
  H: { color: 0xf1f5f9, radius: 0.22, pbrRoughness: 0.4, pbrMetalness: 0.0 },
};

// Procedural 3D Atomic Coordinates for Key Representatives in their Bioactive Pockets
const CONFORMERS: Record<string, Conformer3D> = {
  'Lorlatinib (PF-06463922)': {
    name: 'Lorlatinib (12-mer Macrocycle)',
    description: 'Compact U-shaped macrocyclic conformation pre-organized to fit ALK ATP pocket without steric collision at Gly1202/Arg1202.',
    atoms: [
      // Hinge-binding 2-aminopyridine core
      { element: 'N', pos: [0.0, 0.0, 0.0], name: 'N1 (Hinge Acceptor)' },
      { element: 'C', pos: [1.1, 0.6, 0.0], isMacrocycleRing: true },
      { element: 'C', pos: [1.1, 2.0, 0.0], isMacrocycleRing: true },
      { element: 'C', pos: [0.0, 2.7, 0.0] },
      { element: 'C', pos: [-1.1, 2.0, 0.0] },
      { element: 'C', pos: [-1.1, 0.6, 0.0] },
      { element: 'N', pos: [-2.2, -0.1, 0.0], name: '2-NH2 (Hinge Donor)' },
      // Pyrazole moiety
      { element: 'C', pos: [0.0, 4.1, 0.0] },
      { element: 'C', pos: [-0.9, 5.0, 0.3] },
      { element: 'N', pos: [-0.4, 6.1, 0.3] },
      { element: 'N', pos: [0.9, 6.0, 0.1] },
      { element: 'C', pos: [1.2, 4.8, -0.1] },
      { element: 'C', pos: [2.0, 7.0, 0.1], name: 'N-Me' },
      // Macrocyclic ether bridge
      { element: 'O', pos: [2.2, -0.2, 0.2], isMacrocycleRing: true, name: 'Ether O' },
      { element: 'C', pos: [3.4, 0.4, 0.4], isMacrocycleRing: true, name: '(10R)-CH' },
      { element: 'C', pos: [3.6, 0.8, 1.8], name: '(10R)-Me' },
      // Fluorophenyl ring
      { element: 'C', pos: [4.4, -0.4, -0.3], isMacrocycleRing: true },
      { element: 'C', pos: [4.2, -1.8, -0.4], isMacrocycleRing: true },
      { element: 'C', pos: [5.1, -2.6, -1.0] },
      { element: 'C', pos: [6.3, -2.1, -1.5] },
      { element: 'F', pos: [7.2, -2.9, -2.1], name: '12-Fluoro' },
      { element: 'C', pos: [6.5, -0.7, -1.4] },
      { element: 'C', pos: [5.6, 0.1, -0.8] },
      { element: 'C', pos: [5.8, 1.5, -0.7], name: 'C#N (Nitrile)' },
      { element: 'N', pos: [6.0, 2.7, -0.6], name: 'Nitrile N' },
      // Macrocyclic amide tether back to pyridine
      { element: 'C', pos: [2.9, -2.4, 0.1], isMacrocycleRing: true, name: 'Amide C=O' },
      { element: 'O', pos: [2.9, -3.6, 0.3] },
      { element: 'N', pos: [1.8, -1.6, 0.1], isMacrocycleRing: true, name: 'Lactam N' },
      { element: 'C', pos: [0.5, -2.2, 0.3], name: 'N-Me' },
    ],
    bonds: [
      { from: 0, to: 1, order: 2, isMacrocycleRing: true },
      { from: 1, to: 2, order: 1, isMacrocycleRing: true },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
      { from: 5, to: 6, order: 1 },
      { from: 3, to: 7, order: 1 },
      { from: 7, to: 8, order: 2 },
      { from: 8, to: 9, order: 1 },
      { from: 9, to: 10, order: 2 },
      { from: 10, to: 11, order: 1 },
      { from: 11, to: 7, order: 1 },
      { from: 10, to: 12, order: 1 },
      { from: 1, to: 13, order: 1, isMacrocycleRing: true },
      { from: 13, to: 14, order: 1, isMacrocycleRing: true },
      { from: 14, to: 15, order: 1 },
      { from: 14, to: 16, order: 1, isMacrocycleRing: true },
      { from: 16, to: 17, order: 2, isMacrocycleRing: true },
      { from: 17, to: 18, order: 1 },
      { from: 18, to: 19, order: 2 },
      { from: 19, to: 20, order: 1 },
      { from: 19, to: 21, order: 1 },
      { from: 21, to: 22, order: 2 },
      { from: 22, to: 16, order: 1 },
      { from: 22, to: 23, order: 1 },
      { from: 23, to: 24, order: 2 },
      { from: 17, to: 25, order: 1, isMacrocycleRing: true },
      { from: 25, to: 26, order: 2 },
      { from: 25, to: 27, order: 1, isMacrocycleRing: true },
      { from: 27, to: 28, order: 1 },
      { from: 27, to: 2, order: 1, isMacrocycleRing: true }, // Closes 12-membered ring!
    ]
  },
  'Crizotinib (PF-02341066)': {
    name: 'Crizotinib (Acyclic 1st Gen)',
    description: 'Flexible acyclic linear conformation. The extended piperidine reaches out into the solvent-exposed front, causing clash with Arg1202.',
    atoms: [
      // Hinge-binding 2-aminopyridine
      { element: 'N', pos: [0.0, 0.0, 0.0], name: 'N1 (Hinge Acceptor)' },
      { element: 'C', pos: [1.1, 0.6, 0.0] },
      { element: 'C', pos: [1.1, 2.0, 0.0] },
      { element: 'C', pos: [0.0, 2.7, 0.0] },
      { element: 'C', pos: [-1.1, 2.0, 0.0] },
      { element: 'C', pos: [-1.1, 0.6, 0.0] },
      { element: 'N', pos: [-2.2, -0.1, 0.0], name: '2-NH2 (Hinge Donor)' },
      // Pyrazole
      { element: 'C', pos: [0.0, 4.1, 0.0] },
      { element: 'C', pos: [-0.9, 5.0, 0.3] },
      { element: 'N', pos: [-0.4, 6.1, 0.3] },
      { element: 'N', pos: [0.9, 6.0, 0.1] },
      { element: 'C', pos: [1.2, 4.8, -0.1] },
      // Acyclic piperidine chain extending out to solvent front
      { element: 'C', pos: [1.8, 7.1, 0.3] },
      { element: 'C', pos: [1.2, 8.4, -0.2] },
      { element: 'C', pos: [2.2, 9.5, 0.1] },
      { element: 'N', pos: [3.5, 9.1, -0.4], name: 'Piperidine NH (Clash Site)' },
      { element: 'C', pos: [4.0, 7.8, 0.1] },
      { element: 'C', pos: [3.1, 6.7, -0.2] },
      // Acyclic (R)-benzylic dichlorofluorophenyl ether
      { element: 'O', pos: [2.2, -0.2, 0.2] },
      { element: 'C', pos: [3.4, 0.4, 0.5] },
      { element: 'C', pos: [3.5, 0.8, 1.9], name: '(R)-Me' },
      { element: 'C', pos: [4.5, -0.4, -0.2] },
      { element: 'C', pos: [4.4, -1.8, -0.3] },
      { element: 'Cl', pos: [3.0, -2.7, 0.2], name: '2-Chloro' },
      { element: 'C', pos: [5.4, -2.5, -0.9] },
      { element: 'F', pos: [5.3, -3.8, -1.0], name: '3-Fluoro' },
      { element: 'C', pos: [6.6, -1.9, -1.5] },
      { element: 'C', pos: [6.7, -0.5, -1.4] },
      { element: 'C', pos: [5.7, 0.2, -0.8] },
      { element: 'Cl', pos: [5.9, 1.9, -0.7], name: '6-Chloro' },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
      { from: 5, to: 6, order: 1 },
      { from: 3, to: 7, order: 1 },
      { from: 7, to: 8, order: 2 },
      { from: 8, to: 9, order: 1 },
      { from: 9, to: 10, order: 2 },
      { from: 10, to: 11, order: 1 },
      { from: 11, to: 7, order: 1 },
      // Piperidine ring bonds
      { from: 10, to: 12, order: 1 },
      { from: 12, to: 13, order: 1 },
      { from: 13, to: 14, order: 1 },
      { from: 14, to: 15, order: 1 },
      { from: 15, to: 16, order: 1 },
      { from: 16, to: 17, order: 1 },
      { from: 17, to: 12, order: 1 },
      // Dichlorofluorophenyl ether
      { from: 1, to: 18, order: 1 },
      { from: 18, to: 19, order: 1 },
      { from: 19, to: 20, order: 1 },
      { from: 19, to: 21, order: 1 },
      { from: 21, to: 22, order: 2 },
      { from: 22, to: 23, order: 1 },
      { from: 22, to: 24, order: 1 },
      { from: 24, to: 25, order: 1 },
      { from: 24, to: 26, order: 2 },
      { from: 26, to: 27, order: 1 },
      { from: 27, to: 28, order: 2 },
      { from: 28, to: 21, order: 1 },
      { from: 28, to: 29, order: 1 },
    ]
  },
  'NVL-655 (4th Gen Macrocycle)': {
    name: 'NVL-655 (14-mer ALK Macrocycle)',
    description: '4th-generation compact macrocycle with engineered geometry avoiding TRK neurotoxicity while circumventing compound G1202R/L1196M mutations.',
    atoms: [
      { element: 'N', pos: [0.0, 0.0, 0.0] },
      { element: 'C', pos: [1.1, 0.6, 0.0], isMacrocycleRing: true },
      { element: 'C', pos: [1.0, 2.0, 0.0], isMacrocycleRing: true },
      { element: 'C', pos: [-0.1, 2.7, 0.0] },
      { element: 'C', pos: [-1.2, 2.0, 0.0] },
      { element: 'C', pos: [-1.1, 0.6, 0.0] },
      { element: 'N', pos: [-2.1, -0.1, 0.0] },
      // Pyrazole
      { element: 'C', pos: [-0.1, 4.1, 0.0] },
      { element: 'C', pos: [-1.0, 5.0, 0.2] },
      { element: 'N', pos: [-0.5, 6.1, 0.2] },
      { element: 'N', pos: [0.8, 6.0, 0.1] },
      { element: 'C', pos: [1.0, 4.8, -0.1] },
      // Substituted fluorophenyl ring
      { element: 'C', pos: [1.8, 7.0, 0.2] },
      { element: 'C', pos: [2.9, 6.8, -0.6] },
      { element: 'C', pos: [3.9, 7.7, -0.6] },
      { element: 'F', pos: [5.0, 7.5, -1.3] },
      { element: 'C', pos: [3.7, 8.9, 0.2] },
      { element: 'C', pos: [2.6, 9.1, 1.0] },
      { element: 'C', pos: [1.6, 8.2, 1.0] },
      // 14-membered macrocyclic bridge
      { element: 'O', pos: [2.2, -0.2, 0.2], isMacrocycleRing: true },
      { element: 'C', pos: [3.4, 0.4, 0.4], isMacrocycleRing: true },
      { element: 'C', pos: [3.5, 0.8, 1.8] },
      { element: 'C', pos: [4.4, -0.4, -0.2], isMacrocycleRing: true },
      { element: 'C', pos: [4.3, -1.8, -0.3], isMacrocycleRing: true },
      { element: 'F', pos: [5.3, -2.5, -0.9] },
      { element: 'C', pos: [3.0, -2.5, 0.1], isMacrocycleRing: true },
      { element: 'O', pos: [3.0, -3.7, 0.3] },
      { element: 'N', pos: [1.8, -1.8, 0.1], isMacrocycleRing: true },
      { element: 'C', pos: [1.7, -0.4, 0.1], isMacrocycleRing: true },
    ],
    bonds: [
      { from: 0, to: 1, order: 2, isMacrocycleRing: true },
      { from: 1, to: 2, order: 1, isMacrocycleRing: true },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
      { from: 5, to: 6, order: 1 },
      { from: 3, to: 7, order: 1 },
      { from: 7, to: 8, order: 2 },
      { from: 8, to: 9, order: 1 },
      { from: 9, to: 10, order: 2 },
      { from: 10, to: 11, order: 1 },
      { from: 11, to: 7, order: 1 },
      { from: 10, to: 12, order: 1 },
      { from: 12, to: 13, order: 2 },
      { from: 13, to: 14, order: 1 },
      { from: 14, to: 15, order: 1 },
      { from: 14, to: 16, order: 2 },
      { from: 16, to: 17, order: 1 },
      { from: 17, to: 18, order: 2 },
      { from: 18, to: 12, order: 1 },
      { from: 1, to: 19, order: 1, isMacrocycleRing: true },
      { from: 19, to: 20, order: 1, isMacrocycleRing: true },
      { from: 20, to: 21, order: 1 },
      { from: 20, to: 22, order: 1, isMacrocycleRing: true },
      { from: 22, to: 23, order: 2, isMacrocycleRing: true },
      { from: 23, to: 24, order: 1 },
      { from: 23, to: 25, order: 1, isMacrocycleRing: true },
      { from: 25, to: 26, order: 2 },
      { from: 25, to: 27, order: 1, isMacrocycleRing: true },
      { from: 27, to: 28, order: 1, isMacrocycleRing: true },
      { from: 28, to: 2, order: 1, isMacrocycleRing: true },
    ]
  }
};

interface ThreeDmolViewerProps {
  initialCompoundName?: string;
  onCompoundChange?: (name: string) => void;
}

export const ThreeDmolViewer: React.FC<ThreeDmolViewerProps> = ({
  initialCompoundName = 'Lorlatinib (PF-06463922)',
  onCompoundChange
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedConformerKey, setSelectedConformerKey] = useState<string>(initialCompoundName);
  const [renderMode, setRenderMode] = useState<'ballAndStick' | 'spaceFilling' | 'ribbonPocket'>('ballAndStick');
  const [mutantMode, setMutantMode] = useState<'WT' | 'L1196M' | 'G1202R'>('WT');
  const [showPocketSurface, setShowPocketSurface] = useState<boolean>(true);
  const [showHBonds, setShowHBonds] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'highContrast' | 'darkNeon'>('studio');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const molGroupRef = useRef<THREE.Group | null>(null);
  const pocketGroupRef = useRef<THREE.Group | null>(null);
  const mutantResidueGroupRef = useRef<THREE.Group | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});
  const isSoftwareGlRef = useRef<boolean>(false);

  // Detect Software WebGL
  useEffect(() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      isSoftwareGlRef.current = true;
      return;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    isSoftwareGlRef.current = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingPreset === 'darkNeon' ? 0x090d16 : 0x0f172a);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.025);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3, 14);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGlRef.current,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGlRef.current ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGlRef.current;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGlRef.current;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 30;
    controls.target.set(1.5, 1.5, 0);
    controlsRef.current = controls;

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig: 3-point studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.2);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = !isSoftwareGlRef.current;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 1.6);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    // Ground Contact Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4.5;
    ground.receiveShadow = !isSoftwareGlRef.current;
    scene.add(ground);

    // Groups for dynamic swapping
    const molGroup = new THREE.Group();
    scene.add(molGroup);
    molGroupRef.current = molGroup;

    const pocketGroup = new THREE.Group();
    scene.add(pocketGroup);
    pocketGroupRef.current = pocketGroup;

    const mutantGroup = new THREE.Group();
    scene.add(mutantGroup);
    mutantResidueGroupRef.current = mutantGroup;

    // Render loop and pacing helper
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const glCtx = renderer.getContext() as WebGL2RenderingContext;
      const sync = glCtx.fenceSync(glCtx.SYNC_GPU_COMMANDS_COMPLETE, 0);
      glCtx.flush();
      const poll = () => {
        const state = sync && glCtx.getSyncParameter(sync, glCtx.SYNC_STATUS);
        if (state === glCtx.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          glCtx.deleteSync(sync);
          frameId = window.setTimeout(cb, 70);
        }
      };
      frameId = window.setTimeout(poll, 6);
    }

    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGlRef.current) afterDraw(done);
        else done();
      });
    };
    requestRenderRef.current = requestRender;

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    window.addEventListener('resize', handleResize);
    controls.addEventListener('change', requestRender);

    requestRender();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', requestRender);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lightingPreset]);

  // Re-build 3D Molecular Conformer Mesh
  const buildMoleculeMesh = useCallback(() => {
    const group = molGroupRef.current;
    if (!group) return;

    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    }

    const conformer = CONFORMERS[selectedConformerKey] || CONFORMERS['Lorlatinib (PF-06463922)'];
    const { atoms, bonds } = conformer;

    // Materials cache
    const atomMaterials: Record<string, THREE.MeshPhysicalMaterial> = {};
    Object.keys(ELEMENT_PROPS).forEach((elem) => {
      const prop = ELEMENT_PROPS[elem];
      atomMaterials[elem] = new THREE.MeshPhysicalMaterial({
        color: prop.color,
        roughness: prop.pbrRoughness,
        metalness: prop.pbrMetalness,
        clearcoat: 0.3,
        clearcoatRoughness: 0.1,
      });
    });

    const bondMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.2,
    });

    const macroRingBondMaterial = new THREE.MeshStandardMaterial({
      color: 0xc084fc, // Purple glow for macrocyclic ring bonds!
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x581c87,
      emissiveIntensity: 0.2,
    });

    // 1. Create Atom Spheres
    atoms.forEach((atom) => {
      const prop = ELEMENT_PROPS[atom.element] || ELEMENT_PROPS.C;
      const radius = renderMode === 'spaceFilling' ? prop.radius * 2.2 : prop.radius;
      const geo = new THREE.SphereGeometry(radius, 24, 20);
      const mat = atomMaterials[atom.element] || atomMaterials.C;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(atom.pos[0], atom.pos[1], atom.pos[2]);
      mesh.castShadow = !isSoftwareGlRef.current;
      mesh.receiveShadow = !isSoftwareGlRef.current;
      group.add(mesh);
    });

    // 2. Create Bonds (Cylinders)
    if (renderMode !== 'spaceFilling') {
      bonds.forEach((bond) => {
        const atomA = atoms[bond.from];
        const atomB = atoms[bond.to];
        if (!atomA || !atomB) return;

        const pA = new THREE.Vector3(...atomA.pos);
        const pB = new THREE.Vector3(...atomB.pos);
        const dist = pA.distanceTo(pB);

        const radius = bond.isMacrocycleRing ? 0.14 : 0.1;
        const bondGeo = new THREE.CylinderGeometry(radius, radius, dist, 12);
        const mat = bond.isMacrocycleRing ? macroRingBondMaterial : bondMaterial;
        const bondMesh = new THREE.Mesh(bondGeo, mat);

        // Position & orientation
        const midPoint = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
        bondMesh.position.copy(midPoint);

        const direction = new THREE.Vector3().subVectors(pB, pA).normalize();
        const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        bondMesh.setRotationFromQuaternion(orientation);
        bondMesh.castShadow = !isSoftwareGlRef.current;
        group.add(bondMesh);
      });
    }

    requestRenderRef.current();
  }, [selectedConformerKey, renderMode]);

  // Re-build Kinase Pocket Cavity & Mutant Residues
  const buildPocketAndMutants = useCallback(() => {
    const pocketGroup = pocketGroupRef.current;
    const mutantGroup = mutantResidueGroupRef.current;
    if (!pocketGroup || !mutantGroup) return;

    // Clear previous
    while (pocketGroup.children.length > 0) {
      const c = pocketGroup.children[0] as THREE.Mesh;
      pocketGroup.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) (c.material as THREE.Material).dispose();
    }
    while (mutantGroup.children.length > 0) {
      const c = mutantGroup.children[0] as THREE.Mesh;
      mutantGroup.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) (c.material as THREE.Material).dispose();
    }

    if (showPocketSurface) {
      // 1. Procedural Hinge Region Cavity (Glu1197 - Met1199)
      const hingeMat = new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
        wireframe: false,
        side: THREE.DoubleSide,
      });

      // Semi-transparent pocket contour
      const cavityGeo = new THREE.TorusGeometry(3.8, 1.2, 16, 40, Math.PI * 1.5);
      const cavityMesh = new THREE.Mesh(cavityGeo, hingeMat);
      cavityMesh.position.set(0.5, 1.8, -0.8);
      cavityMesh.rotation.z = Math.PI / 4;
      pocketGroup.add(cavityMesh);

      // Hinge backbone ribbon representation
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.0, -1.5, 0.0),
        new THREE.Vector3(-2.2, 0.0, 0.0),
        new THREE.Vector3(-1.5, 1.5, -0.5),
        new THREE.Vector3(-0.8, 2.5, -0.8),
        new THREE.Vector3(0.5, 3.2, -1.0),
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.28, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3,
        metalness: 0.3,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      pocketGroup.add(tubeMesh);
    }

    // 2. Gatekeeper Residue (Position: [3.8, 1.2, -1.8])
    const gatekeeperPos = new THREE.Vector3(3.8, 1.2, -1.8);
    if (mutantMode === 'L1196M') {
      // Bulky Methionine gatekeeper: larger sulfur-containing sidechain
      const metMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Amber
        roughness: 0.3,
        metalness: 0.2,
      });
      const metCore = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), metMat);
      metCore.position.copy(gatekeeperPos);
      mutantGroup.add(metCore);

      const sulfurSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 })
      );
      sulfurSphere.position.set(3.4, 1.6, -1.2);
      mutantGroup.add(sulfurSphere);
    } else {
      // Wild-Type Leucine 1196: compact isobutyl
      const leuMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Green
        roughness: 0.4,
        metalness: 0.1,
      });
      const leuMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), leuMat);
      leuMesh.position.copy(gatekeeperPos);
      mutantGroup.add(leuMesh);
    }

    // 3. Solvent-Front Residue (Position: [3.0, 8.5, 0.2])
    const solventFrontPos = new THREE.Vector3(3.0, 8.5, 0.2);
    if (mutantMode === 'G1202R') {
      // Bulky, charged Arginine 1202: Long guanidinium arm invading pocket entrance!
      const argMat = new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red alert!
        roughness: 0.3,
        metalness: 0.2,
      });
      
      // Sidechain segments
      const argArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.6, 12), argMat);
      argArm1.position.set(2.8, 8.2, 0.1);
      mutantGroup.add(argArm1);

      const argGuanidinium = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), argMat);
      argGuanidinium.position.set(2.4, 7.3, 0.0);
      mutantGroup.add(argGuanidinium);

      // Warning clash indicator if Crizotinib is loaded
      if (selectedConformerKey.includes('Crizotinib')) {
        const clashRingGeo = new THREE.RingGeometry(0.9, 1.2, 32);
        const clashRingMat = new THREE.MeshBasicMaterial({
          color: 0xff0033,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const clashRing = new THREE.Mesh(clashRingGeo, clashRingMat);
        clashRing.position.set(2.6, 7.6, 0.2);
        clashRing.rotation.x = Math.PI / 4;
        mutantGroup.add(clashRing);
      }
    } else {
      // Wild-Type Glycine 1202: Hydrogen atom, wide open solvent entrance!
      const glyMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.4,
        metalness: 0.1,
      });
      const glyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), glyMat);
      glyMesh.position.copy(solventFrontPos);
      mutantGroup.add(glyMesh);
    }

    // 4. Hydrogen Bonds (dashed cylinders connecting 2-NH2 to Met1199 and N1 to Met1199 backbone)
    if (showHBonds) {
      const hBondMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      // H-bond 1: N1 acceptor
      const hBond1Geo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
      const hBond1 = new THREE.Mesh(hBond1Geo, hBondMat);
      hBond1.position.set(-0.8, -0.4, 0.0);
      hBond1.rotation.z = Math.PI / 3;
      pocketGroup.add(hBond1);

      // H-bond 2: 2-NH2 donor
      const hBond2Geo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
      const hBond2 = new THREE.Mesh(hBond2Geo, hBondMat);
      hBond2.position.set(-1.8, -0.8, 0.0);
      hBond2.rotation.z = -Math.PI / 3;
      pocketGroup.add(hBond2);
    }

    requestRenderRef.current();
  }, [showPocketSurface, mutantMode, showHBonds, selectedConformerKey]);

  useEffect(() => {
    buildMoleculeMesh();
    buildPocketAndMutants();
  }, [buildMoleculeMesh, buildPocketAndMutants]);

  // Handle Preset Camera Views
  const setCameraPreset = (preset: 'overview' | 'solventFront' | 'gatekeeper' | 'hinge') => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    switch (preset) {
      case 'overview':
        camera.position.set(0, 3, 14);
        controls.target.set(1.5, 1.5, 0);
        break;
      case 'solventFront':
        // Zoom into solvent front Gly1202 / Arg1202
        camera.position.set(2.5, 8.0, 6.0);
        controls.target.set(2.2, 7.5, 0.2);
        break;
      case 'gatekeeper':
        // Angle into Leu1196 / Met1196 pocket
        camera.position.set(5.5, 2.0, 5.0);
        controls.target.set(3.5, 1.2, -1.0);
        break;
      case 'hinge':
        // Direct view of Met1199 hydrogen bonding
        camera.position.set(-2.0, 0.5, 6.0);
        controls.target.set(-0.8, 0.5, 0.0);
        break;
    }
    controls.update();
    requestRenderRef.current();
  };

  const handleSelectCompound = (name: string) => {
    setSelectedConformerKey(name);
    if (onCompoundChange) onCompoundChange(name);
  };

  const isClashActive = mutantMode === 'G1202R' && selectedConformerKey.includes('Crizotinib');
  const isLorlatinibActive = selectedConformerKey.includes('Lorlatinib');

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col justify-between">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP HEADER: Spec Badge & Kinase Target Info */}
      <div className="relative z-10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 backdrop-blur-md pointer-events-auto max-w-md shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              {CONFORMERS[selectedConformerKey]?.name || selectedConformerKey}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
              PDB: 4CLI / 2XP2
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            {CONFORMERS[selectedConformerKey]?.description}
          </p>
        </div>

        {/* Mutation Status Alert Pill */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {mutantMode === 'G1202R' ? (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md ${
              isClashActive 
                ? 'bg-rose-950/90 text-rose-200 border-rose-500 ring-2 ring-rose-500/30' 
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
            }`}>
              {isClashActive ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Steric Clash with Arg1202 (Resistant!)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Macrocycle Clears Arg1202 (Potent Solver)</span>
                </>
              )}
            </div>
          ) : mutantMode === 'L1196M' ? (
            <div className="px-3 py-1.5 rounded-xl border bg-amber-950/90 text-amber-200 border-amber-500 text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
              <Dna className="w-4 h-4 text-amber-400" />
              <span>Gatekeeper Mutation Active (L1196M)</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl border bg-slate-900/80 text-slate-300 border-slate-700 text-xs font-medium flex items-center gap-2 shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ALK Kinase ATP Pocket (Wild-Type)</span>
            </div>
          )}
        </div>
      </div>

      {/* ZERO-OCCLUSION COLLAPSIBLE BOTTOM CONTROL DOCK */}
      <div className="relative z-20 pb-4 px-4 w-full flex flex-col items-center pointer-events-none">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="pointer-events-auto mb-2 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all"
          aria-label={isControlsCollapsed ? 'Show 3D controls' : 'Hide 3D controls for zen mode'}
        >
          {isControlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              Hide Controls (Zen Mode)
            </>
          )}
        </button>

        {/* Main Dock Container */}
        <div className={`pointer-events-auto w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-lg transition-all duration-300 ${
          isControlsCollapsed ? 'opacity-0 translate-y-8 pointer-events-none h-0 p-0 overflow-hidden border-none' : 'opacity-100 translate-y-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
            {/* Left 4 cols: Compound Selector & Conformer Switch */}
            <div className="md:col-span-4 space-y-1.5 pr-2 border-b md:border-b-0 md:border-r border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                3D Conformer
              </span>
              <div className="flex flex-col gap-1">
                {Object.keys(CONFORMERS).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSelectCompound(key)}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-all truncate flex items-center justify-between ${
                      selectedConformerKey === key
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{key}</span>
                    {key.includes('Macrocycle') && (
                      <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded ml-1">
                        Cyclic
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle 5 cols: Mutant Stress Test & Pocket Representation */}
            <div className="md:col-span-5 space-y-2 px-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Kinase Active-Site Mutations (Steric Stress Test)
                </span>
                <div className="inline-flex w-full rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={() => setMutantMode('WT')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-colors ${
                      mutantMode === 'WT' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Wild-Type
                  </button>
                  <button
                    onClick={() => setMutantMode('L1196M')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-colors ${
                      mutantMode === 'L1196M' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    L1196M (Gatekeeper)
                  </button>
                  <button
                    onClick={() => setMutantMode('G1202R')}
                    className={`flex-1 py-1 rounded-md text-center font-medium transition-colors ${
                      mutantMode === 'G1202R' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    G1202R (Solvent Front)
                  </button>
                </div>
              </div>

              {/* Toggles for Surfaces & H-Bonds */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowPocketSurface(!showPocketSurface)}
                  className={`flex-1 py-1 px-2 rounded-lg border text-[11px] font-medium transition-colors flex items-center justify-center gap-1 ${
                    showPocketSurface
                      ? 'bg-slate-800 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  Pocket Contour
                </button>
                <button
                  onClick={() => setShowHBonds(!showHBonds)}
                  className={`flex-1 py-1 px-2 rounded-lg border text-[11px] font-medium transition-colors flex items-center justify-center gap-1 ${
                    showHBonds
                      ? 'bg-slate-800 border-sky-500 text-sky-300'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  H-Bonds
                </button>
              </div>
            </div>

            {/* Right 3 cols: Camera Presets & Representations */}
            <div className="md:col-span-3 space-y-1.5 pl-2 border-t md:border-t-0 md:border-l border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Camera Angles
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setCameraPreset('overview')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-colors"
                >
                  Overview
                </button>
                <button
                  onClick={() => setCameraPreset('solventFront')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-colors"
                >
                  Solvent Front
                </button>
                <button
                  onClick={() => setCameraPreset('gatekeeper')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-colors"
                >
                  Gatekeeper
                </button>
                <button
                  onClick={() => setCameraPreset('hinge')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium transition-colors"
                >
                  Hinge H-Bond
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => setRenderMode(renderMode === 'ballAndStick' ? 'spaceFilling' : 'ballAndStick')}
                  className="text-slate-400 hover:text-white underline text-[10px]"
                >
                  Mode: {renderMode === 'ballAndStick' ? 'Ball & Stick' : 'CPK Space-Filling'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
