varying vec3 vNormalW;


void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

	vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );

    gl_Position = projectedPosition;
}