// --- HERO 3D PLANET ---
export function createPlanet3D() {
    const container = document.getElementById('planet3d');
    if (!container) return;
    container.innerHTML = '';

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Création de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Créer un gestionnaire de chargement pour suivre le progrès
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onError = function(url) {
        console.error('Erreur lors du chargement:', url);
    };

    // TEXTURES - Utiliser des URL plus fiables de textures de la Terre
    const textureLoader = new THREE.TextureLoader(loadingManager);

    // Texture de la Terre (jour)
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    // Texture des nuages
    const cloudsTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');
    // Texture de la Terre (nuit) - version avec lumières plus visibles
    const nightTexture = textureLoader.load('https://groovemechanic.net/three.js/examples/textures/planets/earth_lights_2048.png');
    // Texture de normales pour le relief
    const normalMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    // Texture de spécularité
    const specularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');


    // --- EARTH SHADER WITH DAY/NIGHT CYCLE ---
    // --- EARTH SHADER WITH FIXED DAY/NIGHT SIDES ---
    const earthShaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            dayTexture: {
                value: earthTexture
            },
            nightTexture: {
                value: nightTexture
            },
            cloudsTexture: {
                value: cloudsTexture
            },
            normalMap: {
                value: normalMap
            },
            specularMap: {
                value: specularMap
            },
            // Direction fixe du soleil vers la gauche (pour avoir la nuit à droite)
            sunDirection: {
                value: new THREE.Vector3(-1.5, 1, 0.8).normalize()
            }
        },
        vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
        fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudsTexture;
    uniform sampler2D normalMap;
    uniform sampler2D specularMap;
    uniform vec3 sunDirection;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
        // Utiliser la normale pour déterminer la face exposée au soleil
        vec3 normalVector = normalize(vNormal);
        
        // Obtenir la normale du normalMap
        vec3 normalMapValue = texture2D(normalMap, vUv).xyz;
        normalMapValue = normalMapValue * 2.0 - 1.0;
        
        // Calculer l'éclairage
        float lightIntensity = max(0.0, dot(normalVector, sunDirection));
        
        // Transition jour/nuit plus nette pour mieux voir les lumières
        float dayNightMix = smoothstep(-0.05, 0.1, lightIntensity);
        
        // Obtenir les couleurs des textures
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv);
        
        // Rendre les lumières de nuit plus visibles/brillantes
        nightColor.rgb *= 2.0; // Amplifier les lumières
        
        // Mélanger les textures jour et nuit
        vec4 earthColor = mix(nightColor, dayColor, dayNightMix);
        
        // Ajouter les nuages (moins visibles la nuit pour voir les lumières)
        vec4 cloudsColor = texture2D(cloudsTexture, vUv);
        
        // Effet de lumière sur les nuages
        vec4 clouds = vec4(cloudsColor.rgb * max(0.2, dayNightMix), cloudsColor.a * 0.6);
        
        // Combiner la Terre et les nuages
        vec4 finalColor = vec4(earthColor.rgb, 1.0);
        // Moins de nuages sur la partie nuit
        float cloudMix = mix(0.3, 0.7, dayNightMix);
        finalColor = mix(finalColor, clouds, clouds.a * cloudMix);
        
        // Ajouter un effet de brillance spéculaire sur le côté jour
        vec4 specularValue = texture2D(specularMap, vUv);
        float specularIntensity = pow(max(0.0, dot(reflect(-sunDirection, normalVector), normalize(-vPosition))), 20.0);
        finalColor.rgb += specularValue.rgb * specularIntensity * 0.3 * dayNightMix;
        
        // Ajuster la luminosité et la saturation
        finalColor.rgb *= 1.2;  // Augmenter la luminosité
        
        // Saturation
        float luminance = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));
        finalColor.rgb = mix(vec3(luminance), finalColor.rgb, 1.5);  // Augmenter la saturation
        
        gl_FragColor = finalColor;
    }
`
    });

    // --- EARTH SPHERE ---
    const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const earth = new THREE.Mesh(earthGeometry, earthShaderMaterial);
    scene.add(earth);

    // --- ATMOSPHERE GLOW ---
    // Définir un matériau pour l'atmosphère avec un effet bleu plus clair
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            "c": {
                value: 0.12
            },
            "p": {
                value: 5.0
            },
            glowColor: {
                value: new THREE.Color(0x69b3ff) // Bleu plus clair
            },
            viewVector: {
                value: camera.position
            }
        },
        vertexShader: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(c - dot(vNormal, vNormel), p);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
        fragmentShader: `
    uniform vec3 glowColor;
    varying float intensity;
    void main() {
        vec3 glow = glowColor * intensity;
        gl_FragColor = vec4(glow, intensity * 0.8); // Plus transparent
    }
`,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    // Atmosphère légèrement plus proche de la planète
    const atmosphereGeometry = new THREE.SphereGeometry(1.7, 62, 62);
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.set(0, 0, 0);
    scene.add(atmosphere);

    // --- LIGHTS ---
    // Lumière ambiante
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    // Lumière directionnelle (comme le soleil)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    // Position fixe pour avoir la nuit à droite
    directionalLight.position.set(-1.5, 1, 0.8);
    scene.add(directionalLight);

    // --- ANIMATION ---
    function animate() {
        requestAnimationFrame(animate);

        // Rotation de la Terre - vitesse réduite
        earth.rotation.y += 0.002;


        // Direction fixe du soleil - pas de changement dynamique
        // La direction du soleil reste fixe pour garder la nuit à droite

        // Mettre à jour les vecteurs de vue pour l'effet de lueur
        atmosphereMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(
            camera.position, atmosphere.position
        );

        renderer.render(scene, camera);
    }

    animate();
}