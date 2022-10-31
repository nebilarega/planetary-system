uniform vec2 uFrequency;
uniform float uTime;
uniform vec3 uPosition;

varying vec2 vUv;
varying float vElevation;
varying float vTime;
varying vec3 vPosition;
varying vec3 vPositionW;
varying vec3 vNormalW;

void main()
{
    // position = uPosition;
    vec3 newPosition = position;
    newPosition.x += uPosition.x;
    newPosition.y += uPosition.y;
    newPosition.z += uPosition.z;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    // modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
	vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );

    gl_Position = projectedPosition;

    vUv = uv;
    vTime = uTime;
    // vElevation = elevation;
    vPosition = position;
}