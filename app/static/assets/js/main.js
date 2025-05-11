// Gérer le redimensionnement de la fenêtre
function handleResize() {
    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
}
window.addEventListener('resize', handleResize);