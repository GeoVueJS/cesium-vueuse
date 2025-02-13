uniform vec4 color;
uniform float speed;

#define PI 3.14159265359

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;

  float dis = distance(st, vec2(0.5, 0.5));

  vec2 scrPt = st * 2.0 - 1.0;
  float time = czm_frameNumber * speed / 1000.0;
  mat2 rot;
  float theta = -time * 1.0 * PI - 2.2;
  float cosTheta, sinTheta;
  cosTheta = cos(theta);
  sinTheta = sin(theta);
  rot[0][0] = cosTheta;
  rot[0][1] = -sinTheta;
  rot[1][0] = sinTheta;
  rot[1][1] = cosTheta;
  vec2 scrPtRot = rot * scrPt;
  float angle = 1.0 - (atan(scrPtRot.y, scrPtRot.x) / 6.2831 + 0.5);
  float falloff = length(scrPtRot);
  material.alpha = pow(angle, 2.0) * falloff;
  material.diffuse = color.rgb;

  if(dis > 0.47) {
    float perDis = 0.5 / 1.0;
    float disNum;
    float bl = .0;
    for(int i = 0; i <= 9; i++) {
      if(float(i) <= 1.0) {
        disNum = perDis * float(i) - dis;
        if(disNum > 0.0) {
          if(disNum < perDis) {
            bl = 1.0 - disNum / perDis;
          } else if(disNum - perDis < perDis) {
            bl = 1.0 - abs(1.0 - disNum / perDis);
          }
          float alpha = 1.0 - (0.5 - dis) / 0.03;
          if(material.alpha < alpha) {
            material.alpha = alpha;
          }
        }
      }
    }
  }
  return material;
}
