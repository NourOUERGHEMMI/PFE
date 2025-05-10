// --- HERO 3D PLANET ---
function createPlanet3D() {
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

    // Gérer le redimensionnement de la fenêtre
    function handleResize() {
        const newWidth = container.offsetWidth;
        const newHeight = container.offsetHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    }

    window.addEventListener('resize', handleResize);
}

// Initialiser la planète après le chargement du DOM
document.addEventListener('DOMContentLoaded', createPlanet3D);


// --- KEY FEATURES REVEAL & CIRCLE ROTATION ---
document.addEventListener('DOMContentLoaded', function() {
    const keyFeaturesSection = document.getElementById('features');
    const circleContainer = document.querySelector('.fixed-circle-container');
    const sectionsContainer = document.querySelector('.sections-container');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');
    const circleDots = document.querySelectorAll('.circle-dot');
    let currentSection = 0;
    let isAnimating = false;
    let isLocked = false;

    // Fonction pour activer/désactiver le scroll du body
    function lockBodyScroll(lock) {
        if (lock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Fonction pour savoir si on est dans la section Key Features
    function isInKeyFeatures() {
        const rect = keyFeaturesSection.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > window.innerHeight;
    }

    // Gestion du scroll principal
    function onScroll() {
        const rect = keyFeaturesSection.getBoundingClientRect();
        // Si on est dans la section Key Features
        if (rect.top <= 0 && rect.bottom > window.innerHeight) {
            if (!isLocked) {
                lockBodyScroll(true);
                circleContainer.classList.add('fixed');
                isLocked = true;

                // S'assurer que la section actuelle est correctement positionnée
                goToSection(currentSection, false);
            }
        } else {
            // On sort de la section par le haut (scroll up) et on est à la première feature
            if (rect.top > 0 && isLocked && currentSection === 0) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
            }
            // On sort de la section par le bas (scroll down) et on est à la dernière feature
            else if (rect.bottom <= window.innerHeight && isLocked && currentSection === sections.length - 1) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
            }
        }
    }

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();

    // Gestion du scroll interne dans Key Features
    function goToSection(index, animate = true) {
        if ((isAnimating && animate) || index === currentSection) return;
        if (animate) isAnimating = true;
        currentSection = index;

        // Mettre à jour la position des sections
        sectionsContainer.style.transform = `translateY(-${index * 100}vh)`;

        // Faire tourner le cercle
        const rotation = sections[index].getAttribute('data-rotation');
        document.getElementById('rotating-circle').style.transform = `rotate(${rotation}deg)`;

        // Mettre à jour les indicateurs de navigation
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Mettre à jour les dots sur le cercle
        updateActiveDot(index);

        if (animate) {
            setTimeout(() => {
                isAnimating = false;
            }, 700);
        }
    }

    function updateActiveDot(index) {
        // S'assurer que tous les dots sur le cercle sont mis à jour correctement
        circleDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Initialiser les dots du cercle
    function initCircleDots() {
        circleDots.forEach((dot, index) => {
            // S'assurer que chaque dot a le bon attribut data-index
            dot.setAttribute('data-index', index);

            // Ajouter l'événement click sur chaque dot
            dot.addEventListener('click', () => {
                if (!isLocked) return;
                goToSection(index);
            });

            // Activer le premier dot par défaut
            if (index === 0) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Appeler cette fonction pour initialiser les dots correctement
    initCircleDots();

    // Navigation par la molette de la souris
    window.addEventListener('wheel', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            goToSection(currentSection - 1);
        } else if (e.deltaY > 0 && currentSection === sections.length - 1) {
            // On sort de la section Key Features vers le bas
            lockBodyScroll(false);
            circleContainer.classList.remove('fixed');
            isLocked = false;
            // Scroll la page juste après la section
            window.scrollTo({ top: keyFeaturesSection.offsetTop + keyFeaturesSection.offsetHeight, behavior: 'smooth' });
        } else if (e.deltaY < 0 && currentSection === 0) {
            // On sort de la section Key Features vers le haut
            lockBodyScroll(false);
            circleContainer.classList.remove('fixed');
            isLocked = false;
            // Scroll la page juste avant la section
            window.scrollTo({ top: keyFeaturesSection.offsetTop - window.innerHeight, behavior: 'smooth' });
        }
    });

    // Navigation par les points de navigation
    navDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            if (!isLocked) return;
            const index = parseInt(dot.getAttribute('data-index'));
            goToSection(index);
        });
    });

    // Navigation par les flèches du clavier
    window.addEventListener('keydown', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection > 0) {
            goToSection(currentSection - 1);
        }
    });

    // Support pour le toucher mobile (swipe)
    let touchStartY = 0;
    let touchEndY = 0;
    document.addEventListener('touchstart', (e) => {
        if (!isLocked) return;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (!isLocked) return;
        if (isAnimating) return;

        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                goToSection(currentSection - 1);
            } else if (diff > 0 && currentSection === sections.length - 1) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
                window.scrollTo({ top: keyFeaturesSection.offsetTop + keyFeaturesSection.offsetHeight, behavior: 'smooth' });
            } else if (diff < 0 && currentSection === 0) {
                lockBodyScroll(false);
                circleContainer.classList.remove('fixed');
                isLocked = false;
                window.scrollTo({ top: keyFeaturesSection.offsetTop - window.innerHeight, behavior: 'smooth' });
            }
        }
    });
});

// Demo video modal
document.addEventListener('DOMContentLoaded', function() {
    const demoVideoBox = document.getElementById('demoVideoBox');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.getElementById('closeModal');
    const demoVideo = document.getElementById('demoVideo');

    if (demoVideoBox) {
        demoVideoBox.addEventListener('click', () => {
            videoModal.classList.add('active');
            demoVideo.currentTime = 0;
            demoVideo.play();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            videoModal.classList.remove('active');
            demoVideo.pause();
        });
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                demoVideo.pause();
            }
        });
    }
});

// --- Placement des dots sur la grande cercle ---
function placeCircleDots() {
    const circle = document.getElementById('rotating-circle');
    if (!circle) return;

    const dots = circle.querySelectorAll('.circle-dot');
    const dotSize = 17; // doit correspondre à .circle-dot { width: 17px; height: 17px; }
    const R = circle.offsetWidth / 2 - dotSize / 2; // Rayon jusqu'au centre du dot
    const centerX = circle.offsetWidth / 2;
    const centerY = circle.offsetHeight / 2;
    const total = dots.length;

    for (let i = 0; i < total; i++) {
        const angle = (i / total) * 2 * Math.PI - Math.PI / 2; // commence en haut
        const x = centerX + R * Math.cos(angle) - dotSize / 2;
        const y = centerY + R * Math.sin(angle) - dotSize / 2;
        dots[i].style.left = `${x}px`;
        dots[i].style.top = `${y}px`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    placeCircleDots();

    // Vérifier que les dots sont correctement initialisés dès le départ
    const circleDots = document.querySelectorAll('.circle-dot');
    if (circleDots.length > 0) {
        circleDots[0].classList.add('active');
        for (let i = 1; i < circleDots.length; i++) {
            circleDots[i].classList.remove('active');
        }
    }
});

window.addEventListener('resize', placeCircleDots);