in vec2 vUv;

uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform sampler2D uTex;
uniform vec3 uColor;
uniform float uSize;
uniform float uPressure;
uniform float uHardness;

float lineSegment(vec2 p, vec2 a, vec2 b, float size) {
    vec2 d = b - a;
    
    if (length(d) > size) {
      float t = atan(d.y, d.x);
      vec2 u = vec2(cos(t), sin(t));
      vec2 offset = u * size / 3.0;
      a += offset;
      b -= offset;
    }

    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float hs = uHardness * (size - 0.001);
    return smoothstep(hs, size, length(pa - ba*h));
}

void main() {
  vec4 bg = texture2D(uTex, vUv);
  float size = 0.001 * uSize;
  float lineDist = lineSegment(vUv, uPrevMouse, uMouse, size);
  vec4 col = mix(bg, vec4(uColor, 1.0), (1.0 - lineDist) * uPressure);
  pc_fragColor = col;
}
