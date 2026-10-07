<!--
	Click Spark, ported from React Bits (reactbits.dev).
	Every click anywhere on the page bursts a ring of little lines outward.
	One screen-sized canvas sits on top of everything (ignoring the mouse), and
	it only animates while sparks are on screen.
-->
<script lang="ts">
	type Props = {
		color?: string;
		/** Starting length of each line, in px. */
		size?: number;
		/** How far the lines travel, in px. */
		radius?: number;
		/** Lines per click. */
		count?: number;
		/** Milliseconds a burst lasts. */
		duration?: number;
	};

	let { color = '#d97757', size = 10, radius = 15, count = 8, duration = 400 }: Props = $props();

	type Spark = { x: number; y: number; angle: number; start: number };

	let canvas: HTMLCanvasElement;

	const easeOut = (t: number) => t * (2 - t);

	$effect(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let sparks: Spark[] = [];
		let frame = 0;

		// Match the canvas to the screen, at the display's pixel density so lines stay sharp.
		function resize() {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = innerWidth * dpr;
			canvas.height = innerHeight * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
		}

		function draw(now: number) {
			ctx!.clearRect(0, 0, innerWidth, innerHeight);
			ctx!.strokeStyle = color;
			ctx!.lineWidth = 2;
			ctx!.lineCap = 'round';

			sparks = sparks.filter((spark) => {
				const progress = (now - spark.start) / duration;
				if (progress >= 1) return false;

				const eased = easeOut(progress);
				const from = eased * radius; // lines fly outward…
				const to = from + size * (1 - eased); // …and shrink as they go
				const cos = Math.cos(spark.angle);
				const sin = Math.sin(spark.angle);

				ctx!.beginPath();
				ctx!.moveTo(spark.x + from * cos, spark.y + from * sin);
				ctx!.lineTo(spark.x + to * cos, spark.y + to * sin);
				ctx!.stroke();
				return true;
			});

			// Stop the loop once every spark has faded; the next click restarts it.
			frame = sparks.length ? requestAnimationFrame(draw) : 0;
		}

		function onClick(e: MouseEvent) {
			const start = performance.now();
			for (let i = 0; i < count; i++) {
				sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / count, start });
			}
			if (!frame) frame = requestAnimationFrame(draw);
		}

		resize();
		window.addEventListener('resize', resize);
		window.addEventListener('click', onClick);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('resize', resize);
			window.removeEventListener('click', onClick);
		};
	});
</script>

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 z-[90] size-full" aria-hidden="true"></canvas>
