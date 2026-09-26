import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type ShaderScrambleProps = {
  text: string;
  delay?: number;
  duration?: number;
  block?: boolean;
  className?: string;
};

const sdfRange = 12;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function distanceTransform(alpha: Uint8ClampedArray, width: number, height: number, targetInside: boolean) {
  const count = width * height;
  const distances = new Float32Array(count);
  const far = width + height;

  for (let index = 0; index < count; index += 1) {
    const inside = alpha[index * 4 + 3] > 127;
    distances[index] = inside === targetInside ? 0 : far;
  }

  const diagonal = Math.SQRT2;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      let distance = distances[index];
      if (x > 0) distance = Math.min(distance, distances[index - 1] + 1);
      if (y > 0) distance = Math.min(distance, distances[index - width] + 1);
      if (x > 0 && y > 0) distance = Math.min(distance, distances[index - width - 1] + diagonal);
      if (x < width - 1 && y > 0) distance = Math.min(distance, distances[index - width + 1] + diagonal);
      distances[index] = distance;
    }
  }

  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = width - 1; x >= 0; x -= 1) {
      const index = y * width + x;
      let distance = distances[index];
      if (x < width - 1) distance = Math.min(distance, distances[index + 1] + 1);
      if (y < height - 1) distance = Math.min(distance, distances[index + width] + 1);
      if (x < width - 1 && y < height - 1) distance = Math.min(distance, distances[index + width + 1] + diagonal);
      if (x > 0 && y < height - 1) distance = Math.min(distance, distances[index + width - 1] + diagonal);
      distances[index] = distance;
    }
  }

  return distances;
}

function createSdfCanvas(text: string, source: HTMLElement, root: HTMLElement, scale: number) {
  const width = Math.max(1, Math.ceil(root.clientWidth * scale));
  const height = Math.max(1, Math.ceil(root.clientHeight * scale));
  const mask = document.createElement("canvas");
  mask.width = width;
  mask.height = height;
  const context = mask.getContext("2d", { willReadFrequently: true });
  if (!context) return null;

  const computed = window.getComputedStyle(source);
  const fontSize = Number.parseFloat(computed.fontSize) || 16;
  const parsedLineHeight = Number.parseFloat(computed.lineHeight);
  const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : fontSize * 1.2;
  const letterSpacing = Number.parseFloat(computed.letterSpacing) || 0;
  const transform = computed.textTransform;
  const displayText = transform === "uppercase"
    ? text.toLocaleUpperCase()
    : transform === "lowercase"
      ? text.toLocaleLowerCase()
      : text;

  context.scale(scale, scale);
  context.font = computed.font || `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
  context.fillStyle = "#fff";
  context.textBaseline = "alphabetic";

  const measure = (value: string) => context.measureText(value).width + Math.max(0, Array.from(value).length - 1) * letterSpacing;
  const maxLineWidth = Math.max(1, root.clientWidth);
  const lines: string[] = [];
  displayText.split("\n").forEach((paragraph) => {
    let line = "";
    paragraph.split(/\s+/).filter(Boolean).forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measure(candidate) > maxLineWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    });
    lines.push(line);
  });

  const metrics = context.measureText("Mg");
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.78;
  const verticalOffset = (lineHeight - fontSize) / 2;
  const textAlign = computed.textAlign;
  lines.forEach((line, lineIndex) => {
    const lineWidth = measure(line);
    let x = textAlign === "center"
      ? (maxLineWidth - lineWidth) / 2
      : textAlign === "right" || textAlign === "end"
        ? maxLineWidth - lineWidth
        : 0;
    const baseline = verticalOffset + ascent + lineIndex * lineHeight;
    Array.from(line).forEach((character) => {
      context.fillText(character, x, baseline);
      x += context.measureText(character).width + letterSpacing;
    });
  });

  const maskData = context.getImageData(0, 0, width, height).data;
  const toInside = distanceTransform(maskData, width, height, true);
  const toOutside = distanceTransform(maskData, width, height, false);
  const sdf = document.createElement("canvas");
  sdf.width = width;
  sdf.height = height;
  const sdfContext = sdf.getContext("2d");
  if (!sdfContext) return null;
  const output = sdfContext.createImageData(width, height);

  for (let index = 0; index < width * height; index += 1) {
    const inside = maskData[index * 4 + 3] > 127;
    const signedDistance = inside ? toOutside[index] : -toInside[index];
    const value = Math.round(clamp(0.5 + signedDistance / (sdfRange * scale * 2), 0, 1) * 255);
    const offset = index * 4;
    output.data[offset] = value;
    output.data[offset + 1] = value;
    output.data[offset + 2] = value;
    output.data[offset + 3] = 255;
  }

  sdfContext.putImageData(output, 0, 0);
  return { canvas: sdf, width, height, fontSize: fontSize * scale, lineHeight: lineHeight * scale };
}

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_sdf;
  uniform vec2 u_resolution;
  uniform vec3 u_textColor;
  uniform float u_time;
  uniform float u_progress;
  uniform float u_cellSize;
  uniform float u_cellCount;
  uniform float u_lineHeight;
  uniform float u_seed;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float glyphCoverage(vec2 uv) {
    return smoothstep(0.46, 0.54, texture2D(u_sdf, uv).r);
  }

  void main() {
    float pixelX = v_uv.x * u_resolution.x;
    float cell = floor(pixelX / u_cellSize);
    float row = floor((1.0 - v_uv.y) * u_resolution.y / u_lineHeight);
    float tick = floor(u_time * 23.0);
    float choice = hash(vec2(cell + row * 31.0 + u_seed, tick));
    float sourceCell = floor(hash(vec2(cell * 17.0 + row + u_seed, tick + 8.0)) * u_cellCount);
    float localX = mod(pixelX, u_cellSize);
    float swap = step(0.63, choice) * u_progress;
    float sampleX = mix(pixelX, sourceCell * u_cellSize + localX, swap);

    float scanRow = floor((1.0 - v_uv.y) * u_resolution.y / 2.0);
    float scanTick = floor(u_time * 37.0);
    float tearChoice = hash(vec2(scanRow + u_seed, scanTick));
    float tear = step(0.965, tearChoice) * u_progress;
    sampleX += (hash(vec2(scanRow, scanTick + u_seed + 4.0)) - 0.5) * u_resolution.x * 0.12 * tear;

    vec2 uv = vec2(clamp(sampleX / u_resolution.x, 0.0, 1.0), v_uv.y);
    float alpha = glyphCoverage(uv);
    float red = glyphCoverage(uv + vec2(1.6 / u_resolution.x, 0.0));
    float blue = glyphCoverage(uv - vec2(1.6 / u_resolution.x, 0.0));
    float fringe = max(red, blue) * u_progress * 0.26;
    float speckle = step(0.997, hash(floor(v_uv * u_resolution / 3.0) + vec2(tick + u_seed, 2.0))) * u_progress;
    float outputAlpha = max(alpha, max(fringe, speckle * 0.18));

    vec3 color = u_textColor * alpha;
    color.r = max(color.r, u_textColor.r * red * u_progress * 0.42);
    color.b = max(color.b, u_textColor.b * blue * u_progress * 0.36);
    color *= 1.0 - step(0.985, hash(vec2(scanRow, scanTick + u_seed + 21.0))) * u_progress * 0.32;
    color += u_textColor * speckle * 0.18;
    gl_FragColor = vec4(color, outputAlpha);
  }
`;

function createRenderer(canvas: HTMLCanvasElement, sdf: NonNullable<ReturnType<typeof createSdfCanvas>>, color: number[], seed: number) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!buffer || !texture) {
    if (buffer) gl.deleteBuffer(buffer);
    if (texture) gl.deleteTexture(texture);
    gl.deleteProgram(program);
    return null;
  }

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sdf.canvas);
  gl.uniform1i(gl.getUniformLocation(program, "u_sdf"), 0);
  gl.uniform2f(gl.getUniformLocation(program, "u_resolution"), sdf.width, sdf.height);
  gl.uniform3f(gl.getUniformLocation(program, "u_textColor"), color[0], color[1], color[2]);
  gl.uniform1f(gl.getUniformLocation(program, "u_cellSize"), Math.max(6, sdf.fontSize * 0.56));
  gl.uniform1f(gl.getUniformLocation(program, "u_cellCount"), sdf.width / Math.max(6, sdf.fontSize * 0.56));
  gl.uniform1f(gl.getUniformLocation(program, "u_lineHeight"), sdf.lineHeight);
  gl.uniform1f(gl.getUniformLocation(program, "u_seed"), seed);
  gl.viewport(0, 0, sdf.width, sdf.height);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  return {
    draw(progress: number, time: number) {
      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "u_progress"), progress);
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), time);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export function ShaderScramble({ text, delay = 0, duration = 980, block = false, className = "" }: ShaderScrambleProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const sourceRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrambling, setScrambling] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    let timer = 0;
    let frame = 0;
    let disposed = false;
    let renderer: ReturnType<typeof createRenderer> = null;

    const start = () => {
      const root = rootRef.current;
      const source = sourceRef.current;
      const canvas = canvasRef.current;
      if (!root || !source || !canvas || !root.clientWidth || !root.clientHeight) return;

      const scale = Math.min(window.devicePixelRatio || 1, 1.25);
      const sdf = createSdfCanvas(text, source, root, scale);
      if (!sdf) return;
      canvas.width = sdf.width;
      canvas.height = sdf.height;

      const computedColor = window.getComputedStyle(source).color.match(/[\d.]+/g)?.slice(0, 3).map((value) => Number(value) / 255);
      const color = computedColor?.length === 3 ? computedColor : [0.96, 0.95, 0.91];
      renderer = createRenderer(canvas, sdf, color, Math.random() * 1000);
      if (!renderer) return;

      const startedAt = performance.now();
      renderer.draw(0, 0);
      setScrambling(true);
      const animate = (now: number) => {
        frame = 0;
        if (disposed || !renderer) return;
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const envelope = progress < 0.18
          ? progress / 0.18
          : progress > 0.7
            ? (1 - progress) / 0.3
            : 1;
        const eased = envelope * envelope * (3 - 2 * envelope);
        renderer.draw(eased, (now - startedAt) / 1000);

        if (progress < 1) {
          frame = window.requestAnimationFrame(animate);
        } else {
          setScrambling(false);
          renderer.destroy();
          renderer = null;
        }
      };
      frame = window.requestAnimationFrame(animate);
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(() => {
      if (!disposed) timer = window.setTimeout(start, delay);
    });

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
      renderer?.destroy();
      renderer = null;
    };
  }, [delay, duration, reducedMotion, text]);

  return (
    <span className={`shader-scramble ${block ? "shader-scramble--block" : "shader-scramble--inline"} ${className} ${scrambling ? "is-scrambling" : ""}`}>
      <span ref={rootRef} className="shader-scramble-layout">
        <span ref={sourceRef} className="shader-scramble-source">{text}</span>
        <canvas ref={canvasRef} className="shader-scramble-canvas" aria-hidden="true" />
      </span>
    </span>
  );
}
