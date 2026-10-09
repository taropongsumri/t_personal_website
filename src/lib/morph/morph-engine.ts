// Morph Slider engine, ported from React Bits (reactbits.dev).
// Draws two images on one WebGL triangle and blends between them with a shader,
// so a slide change "melts" (or ripples / shears / swirls) into the next one.
// Kept free of Svelte so MorphSlider.svelte can load it only in the browser.

import { gsap } from 'gsap';
import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl';

export type MorphTransition = 'melt' | 'ripple' | 'shear' | 'swirl';

export type MorphOptions = {
	transition: MorphTransition;
	/** Seconds per slide change. */
	duration: number;
	/** How strongly the images warp mid-transition. */
	intensity: number;
	/** Size of the melt noise; higher = smaller blobs. */
	scale: number;
	/** Colour fringing at the peak of the transition. */
	aberration: number;
	/** Slow idle wobble of the image. 0 = still (and nothing is drawn while idle). */
	drift: number;
};

const MODES: Record<MorphTransition, number> = { melt: 0, ripple: 1, shear: 2, swirl: 3 };

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Unchanged from React Bits, minus the vignette overlay colour (always black).
const fragment = /* glsl */ `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

// Like CSS object-fit: cover.
vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float ratio = (res.x / max(res.y, 1.0)) / max(img.x / max(img.y, 1.0), 0.0001);
  vec2 s = ratio > 1.0 ? vec2(1.0, 1.0 / ratio) : vec2(ratio, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;
  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float ang = env * uIntensity * 3.5 * (1.0 - length(c));
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 disp = normalize(uv - uPointer + 1e-4) * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float rnd = hash11(floor(uv.y * 14.0));
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);
  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(texture2D(tCurrent, sC + vec2(ca, 0.0)).r, texture2D(tCurrent, sC).g, texture2D(tCurrent, sC - vec2(ca, 0.0)).b);
  vec3 colN = vec3(texture2D(tNext, sN + vec2(ca, 0.0)).r, texture2D(tNext, sN).g, texture2D(tNext, sN - vec2(ca, 0.0)).b);
  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, vec3(0.0), (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

type GL = Renderer['gl'];

/** 1×1 dark texture shown until an image finishes loading. */
function placeholderTexture(gl: GL) {
	return new Texture(gl, { image: new Uint8Array([24, 24, 28, 255]), width: 1, height: 1, generateMipmaps: false });
}

export class MorphEngine {
	private renderer: Renderer;
	private gl: GL;
	private program: Program;
	private mesh: Mesh;
	private textures: Texture[];
	private sizes: [number, number][];
	private resizeObserver: ResizeObserver;
	private tween?: gsap.core.Tween;
	private raf = 0;
	private visible = true;
	private duration: number;
	private drift: number;

	private current: number;
	private animating = false;
	private dragging = false;
	private dragDir = 0;
	private shown: number;

	constructor(
		private container: HTMLElement,
		private images: string[],
		options: MorphOptions,
		private onIndexChange: (index: number) => void,
		private reducedMotion: boolean,
		start = 0
	) {
		this.current = this.shown = start;
		this.duration = options.duration;
		this.drift = options.drift;

		this.renderer = new Renderer({ antialias: true, dpr: Math.min(devicePixelRatio || 1, 2) });
		this.gl = this.renderer.gl;
		const canvas = this.gl.canvas as HTMLCanvasElement;
		canvas.className = 'block size-full';
		container.appendChild(canvas);

		this.textures = images.map(() => placeholderTexture(this.gl));
		this.sizes = images.map(() => [1, 1]);

		this.program = new Program(this.gl, {
			vertex,
			fragment,
			uniforms: {
				tCurrent: { value: this.textures[start] },
				tNext: { value: this.textures[start] },
				uResolution: { value: [1, 1] },
				uCurrentSize: { value: this.sizes[start] },
				uNextSize: { value: this.sizes[start] },
				uProgress: { value: 0 },
				uDir: { value: 1 },
				uMode: { value: MODES[options.transition] },
				uIntensity: { value: options.intensity },
				uScale: { value: options.scale },
				uAberration: { value: options.aberration },
				uDrift: { value: options.drift },
				uTime: { value: 0 },
				uReduce: { value: reducedMotion ? 1 : 0 },
				uPointer: { value: [0.5, 0.5] }
			}
		});
		this.mesh = new Mesh(this.gl, { geometry: new Triangle(this.gl), program: this.program });

		this.resizeObserver = new ResizeObserver(() => this.resize());
		this.resizeObserver.observe(container);
		this.resize();
		this.loadImages();
	}

	private loadImages() {
		this.images.forEach((src, i) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				const texture = new Texture(this.gl, { image: img, generateMipmaps: false });
				this.textures[i] = texture;
				this.sizes[i] = [img.naturalWidth || 1, img.naturalHeight || 1];
				if (i === this.current) this.show(i);
				this.requestRender();
			};
		});
	}

	private resize() {
		const { width, height } = this.container.getBoundingClientRect();
		this.renderer.setSize(Math.max(width, 1), Math.max(height, 1));
		this.program.uniforms.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
		this.requestRender(); // resizing a canvas clears it
	}

	// Rendering is on demand: a frame is drawn only when something changed, and the
	// loop keeps going only while something moves (a transition, a drag, or drift).

	/** Schedule one frame (no-op if one is already scheduled or the slider is off-screen). */
	private requestRender() {
		if (this.visible && !this.raf) this.raf = requestAnimationFrame(this.frame);
	}

	private frame = (t: number) => {
		this.raf = 0;
		this.program.uniforms.uTime.value = t * 0.001;
		this.renderer.render({ scene: this.mesh });
		if (this.animating || this.dragging || this.drift > 0) this.requestRender();
	};

	/** Stop drawing while the slider is off-screen. */
	setVisible(visible: boolean) {
		this.visible = visible;
		if (visible) this.requestRender();
		else {
			cancelAnimationFrame(this.raf);
			this.raf = 0;
		}
	}

	private wrap(i: number) {
		const n = this.images.length;
		return ((i % n) + n) % n;
	}

	private show(i: number) {
		this.program.uniforms.tCurrent.value = this.textures[i];
		this.program.uniforms.uCurrentSize.value = this.sizes[i];
	}

	/** Load `target` as the incoming image. `dir` only sets which way shear/ripple travel. */
	private prepareNext(target: number, dir: number) {
		this.show(this.current);
		this.program.uniforms.tNext.value = this.textures[target];
		this.program.uniforms.uNextSize.value = this.sizes[target];
		this.program.uniforms.uDir.value = dir;
	}

	private announce(i: number) {
		if (i === this.shown) return;
		this.shown = i;
		this.onIndexChange(i);
	}

	private commit(target: number) {
		this.current = target;
		this.show(target);
		this.program.uniforms.uProgress.value = 0;
		this.animating = false;
		this.announce(target);
		this.requestRender(); // draw the settled slide
	}

	/** Move one slide forward (1) or back (-1), with the transition. */
	go(dir: 1 | -1) {
		this.goTo(this.wrap(this.current + dir), dir);
	}

	/** Jump straight to slide `target` (e.g. from a dot), with the transition. */
	goTo(target: number, dir: 1 | -1 = target > this.current ? 1 : -1) {
		if (this.animating || this.dragging || target === this.current) return;
		this.prepareNext(target, dir);
		this.animating = true;
		this.requestRender();
		this.announce(target);
		this.tween = gsap.fromTo(
			this.program.uniforms.uProgress,
			{ value: 0 },
			{
				value: 1,
				duration: this.reducedMotion ? Math.min(this.duration, 0.4) : this.duration,
				ease: 'power2.inOut',
				onComplete: () => this.commit(target)
			}
		);
	}

	// Dragging: the transition follows the finger, then finishes or springs back on release.

	/** x and y are 0–1 inside the slider; used as the ripple's centre. */
	beginDrag(x: number, y: number) {
		if (this.animating || this.images.length < 2) return false;
		this.program.uniforms.uPointer.value = [x, 1 - y];
		this.dragging = true;
		this.dragDir = 0;
		return true;
	}

	/** dx is how far the pointer moved, as a fraction of the slider width. */
	drag(dx: number) {
		if (!this.dragging) return;
		const dir = dx < 0 ? 1 : -1;
		if (dir !== this.dragDir) {
			this.dragDir = dir;
			this.prepareNext(this.wrap(this.current + dir), dir);
		}
		const progress = Math.min(Math.abs(dx), 1);
		this.program.uniforms.uProgress.value = progress;
		this.requestRender();
		this.announce(progress > 0.5 ? this.wrap(this.current + dir) : this.current);
	}

	endDrag() {
		if (!this.dragging) return;
		this.dragging = false;
		if (this.dragDir === 0) return;

		const target = this.wrap(this.current + this.dragDir);
		const finish = (this.program.uniforms.uProgress.value as number) > 0.4;
		this.animating = true;
		this.announce(finish ? target : this.current);
		this.tween = gsap.to(this.program.uniforms.uProgress, {
			value: finish ? 1 : 0,
			duration: this.reducedMotion ? 0.3 : 0.5,
			ease: 'power2.out',
			onComplete: () => {
				if (finish) return this.commit(target);
				this.animating = false;
				this.requestRender();
			}
		});
		this.requestRender();
	}

	destroy() {
		cancelAnimationFrame(this.raf);
		this.tween?.kill();
		this.resizeObserver.disconnect();
		this.gl.getExtension('WEBGL_lose_context')?.loseContext();
		(this.gl.canvas as HTMLCanvasElement).remove();
	}
}
