in vec2 vUv;

uniform sampler2D uTex;
uniform sampler2D uMask;

void main() {
  vec4 px = texture2D(uMask, vUv);
  float clip = 1.0 - px.r;
  float mask = px.g;

  if (clip < 0.1) {
    discard;
  }
  
  vec4 col = vec4(vec3(mask), clip) + texture2D(uTex, vUv) * (1.0 - mask);

  pc_fragColor = col;

}
