varying vec2 vUv;
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vPosition;
varying vec3 vertexNormal;
varying float vIntensityScale;

vec3 brightnessToColor(float b){
    b*=0.25;
    return (vec3(b, b*b, b*b*b*b)/0.25)*.8;
}
void main()
{
    vec3 brightness = brightnessToColor(3.5);
    float intensity = pow(.5 - dot(vNormalW, vec3(0., 0., 1.)), 2.);
    gl_FragColor = vec4(brightness, 1.)*intensity*vIntensityScale;
    // gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0)*intensity;
}