varying vec3 vNormalW;

void main()
{
    float intensity = pow(.5- dot(vNormalW, vec3(0., 0., 1.)), 2.);
    // rgb(.75, .84, .968)
    gl_FragColor = vec4(0.3, 0.6, 1., 1.)*intensity;
}