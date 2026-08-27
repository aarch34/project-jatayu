# Vulture 3D Model Folder

Place your custom 3D Vulture GLB/GLTF model file here named:
`vulture.glb`

Path: `/public/models/vulture.glb`

The application dynamically checks if this file exists:
1. If `/models/vulture.glb` is present, it will automatically load and render your custom 3D model with its built-in animations.
2. If missing, the app seamlessly falls back to the built-in procedural high-detail 3D Vulture model (featuring accurate broad wings, hooked beak, dark plumage, and white neck ruff collar).

## Recommended Model Specs:
- Format: GLTF/GLB (.glb)
- Polygon count: < 30,000 tris recommended
- Textures: Embedded 2K or 1K PBR maps
- Rigging/Animation: Soaring / gliding clip (optional)
