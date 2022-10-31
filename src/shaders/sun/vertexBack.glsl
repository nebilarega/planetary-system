uniform vec2 uFrequency;
uniform vec3 uPosition;
uniform float uIntensityScale;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vertexNormal;
varying float vIntensityScale;


void main()
{
    vec3 newPosition = position;
    newPosition.x += uPosition.x;
    newPosition.y += uPosition.y;
    newPosition.z += uPosition.z;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
	vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );

    gl_Position = projectedPosition;

    vUv = uv;
    vPosition = position;
    vertexNormal = normal;
    vIntensityScale = uIntensityScale;
}