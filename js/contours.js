/* ---------------------------------------------------------
   Animated topographic contour lines (WebGL2), ported from the
   ContourField in the Jamil portfolio project.

   A slowly evolving, domain-warped 3D noise field is sliced into
   iso-lines. Time is the noise's third axis, so the curves genuinely
   morph instead of just drifting. The canvas is transparent: only the
   lines are drawn, so the section background shows through.

   Usage:  const f = createContours(canvas, { line: '#b8a77f', alpha: .55 });
           f.active = false;   // pause (e.g. while hidden)
   --------------------------------------------------------- */
function createContours(canvas, opts = {}) {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return null; // no WebGL2 → no lines, page still works

  const FPS_CAP = 40;
  const vert = `#version 300 es
    void main() {
      vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
      gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
    }`;
  const frag = `#version 300 es
    precision highp float;
    uniform vec2 uRes; uniform float uTime; uniform float uDpr;
    uniform vec3 uLine; uniform float uAlpha; uniform float uScale; uniform float uLevels; uniform float uSeed;
    out vec4 outColor;
    vec3 grad(vec3 p) {
      p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    float gnoise(vec3 p) {
      vec3 i = floor(p), f = fract(p);
      vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(
        mix(mix(dot(grad(i), f), dot(grad(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
            mix(dot(grad(i + vec3(0,1,0)), f - vec3(0,1,0)), dot(grad(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
        mix(mix(dot(grad(i + vec3(0,0,1)), f - vec3(0,0,1)), dot(grad(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
            mix(dot(grad(i + vec3(0,1,1)), f - vec3(0,1,1)), dot(grad(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
        u.z);
    }
    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y) * uScale;
      float t = uTime * 0.06 + uSeed * 7.0;
      vec2 w = vec2(gnoise(vec3(p * 0.5, t)), gnoise(vec3(p * 0.5 + 9.3, t + 4.1)));
      vec3 q = vec3(p + w * 0.6, t * 0.8);
      float n = gnoise(q) * 0.72 + gnoise(q * 2.1 + 17.0) * 0.28;
      float v = n * uLevels;
      float px = abs(fract(v + 0.5) - 0.5) / max(fwidth(v), 1e-5);
      float halfWidth = 0.55 * uDpr;
      float a = (1.0 - smoothstep(halfWidth - 0.6, halfWidth + 0.6, px)) * uAlpha;
      outColor = vec4(uLine * a, a); // premultiplied, transparent background
    }`;

  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const u = {};
  ['uRes', 'uTime', 'uDpr', 'uLine', 'uAlpha', 'uScale', 'uLevels', 'uSeed'].forEach((n) => (u[n] = gl.getUniformLocation(prog, n)));

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  gl.uniform3fv(u.uLine, hex(opts.line || '#b8a77f'));
  gl.uniform1f(u.uAlpha, opts.alpha ?? 0.6);
  gl.uniform1f(u.uScale, opts.scale ?? 1.6);
  gl.uniform1f(u.uLevels, opts.levels ?? 7);
  gl.uniform1f(u.uSeed, opts.seed ?? 1);
  const speed = opts.speed ?? 1;

  let dpr = 1;
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uDpr, dpr);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  // Light, supportive motion: a random starting pattern that drifts very slowly.
  // Redraws only ~12 times a second and only while `active` (section on screen).
  const LIGHT_FPS = 12;
  const start = Math.random() * 1000;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const field = { active: true };
  const draw = (t) => {
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.uTime, start + (still ? 0 : t * speed * 0.35));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  new ResizeObserver(() => { resize(); draw(performance.now() / 1000); }).observe(canvas);
  let last = -1;
  const frame = (ms) => {
    requestAnimationFrame(frame);
    const t = ms / 1000;
    if (!field.active || document.hidden || still || t - last < 1 / LIGHT_FPS) return;
    last = t;
    draw(t);
  };
  draw(0);
  requestAnimationFrame(frame);
  return field;
}
