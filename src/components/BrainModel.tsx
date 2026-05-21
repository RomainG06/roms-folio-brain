import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Matériaux partagés (créés une fois, réutilisés)
const baseMat = new THREE.MeshStandardMaterial({
    color: '#060e1f',
    emissive: '#001530',
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    side: THREE.FrontSide,
})

const wireMat = new THREE.MeshBasicMaterial({
    color: '#1a3a6e',
    wireframe: true,
    transparent: true,
    opacity: 0.12,
})

export function BrainModel() {
    const { scene } = useGLTF('/models/brain.glb')

    useEffect(() => {
        scene.traverse((child) => {
            if (!(child as THREE.Mesh).isMesh) return
            // Ignorer les meshes wireframe qu'on a ajoutés nous-mêmes
            // (sinon traverse les visite aussi et crée une récursion infinie)
            if (child.userData.isWireframe) return

            const mesh = child as THREE.Mesh
            mesh.material = baseMat
            mesh.renderOrder = 1

            if (!mesh.userData.wireframeAdded) {
                const wf = new THREE.Mesh(mesh.geometry, wireMat)
                wf.renderOrder = 2
                wf.userData.isWireframe = true
                mesh.add(wf)
                mesh.userData.wireframeAdded = true
            }
        })
    }, [scene])

    // Calcul automatique du centre du modèle pour le centrer à l'origine
    const centerOffset = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene)
        return box.getCenter(new THREE.Vector3())
    }, [scene])

    // Scale : natif ~200 unités de large → 0.022 × 200 = ~4.4 unités scène
    return (
        <group scale={[0.022, 0.022, 0.022]}>
            {/* Décalage inverse du centre natif pour aligner à l'origine */}
            <group position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}>
                <primitive object={scene} />
            </group>
        </group>
    )
}

useGLTF.preload('/models/brain.glb')
