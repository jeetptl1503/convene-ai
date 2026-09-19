"use client";

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export type ActionName =
  | "Dance"
  | "Death"
  | "Idle"
  | "Jump"
  | "No"
  | "Punch"
  | "Running"
  | "Sitting"
  | "Standing"
  | "ThumbsUp"
  | "Walking"
  | "WalkJump"
  | "Wave"
  | "Yes";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = {
  nodes: {
    Bone: THREE.Bone;
    HandR_1: THREE.SkinnedMesh;
    HandR_2: THREE.SkinnedMesh;
    HandL_1: THREE.SkinnedMesh;
    HandL_2: THREE.SkinnedMesh;
    [key: string]: THREE.Object3D | THREE.Bone | THREE.SkinnedMesh | THREE.Mesh;
  };
  materials: {
    Grey: THREE.MeshStandardMaterial;
    Main: THREE.MeshStandardMaterial;
    Black: THREE.MeshStandardMaterial;
    [key: string]: THREE.Material;
  };
  animations: GLTFAction[];
};

interface RobotProps extends React.ComponentProps<"group"> {
  animation?: ActionName;
  onAnimationChange?: (anim: ActionName) => void;
}

export function RobotAssistant({
  animation = "Idle",
  onAnimationChange,
  ...props
}: RobotProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/robot.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  const [currentAnim, setCurrentAnim] = useState<ActionName>(animation);

  // Play animations with smooth fade transitions
  useEffect(() => {
    const targetAction = actions[currentAnim];
    if (targetAction) {
      targetAction.reset().fadeIn(0.3).play();
      return () => {
        targetAction.fadeOut(0.3);
      };
    }
  }, [actions, currentAnim]);

  // Initial wave greeting on load
  useEffect(() => {
    setCurrentAnim("Wave");
    const timer = setTimeout(() => {
      setCurrentAnim("Idle");
      onAnimationChange?.("Idle");
    }, 2800);
    return () => clearTimeout(timer);
  }, [onAnimationChange]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const cycle: ActionName[] = ["ThumbsUp", "Dance", "Wave", "Jump", "Idle"];
    const nextIdx = (cycle.indexOf(currentAnim) + 1) % cycle.length;
    const next = cycle[nextIdx];
    setCurrentAnim(next);
    onAnimationChange?.(next);
  };

  if (!nodes.Bone) {
    return null;
  }

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onClick={handleClick}
    >
      <group name="Root_Scene">
        <group name="RootNode">
          <group
            name="RobotArmature"
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          >
            <primitive object={nodes.Bone} />
          </group>
          {nodes.HandR_1 && nodes.HandR_2 && (
            <group
              name="HandR"
              position={[-0.003, 2.37, -0.021]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}
            >
              <skinnedMesh
                name="HandR_1"
                geometry={(nodes.HandR_1 as THREE.SkinnedMesh).geometry}
                material={materials.Main}
                skeleton={(nodes.HandR_1 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="HandR_2"
                geometry={(nodes.HandR_2 as THREE.SkinnedMesh).geometry}
                material={materials.Grey}
                skeleton={(nodes.HandR_2 as THREE.SkinnedMesh).skeleton}
              />
            </group>
          )}
          {nodes.HandL_1 && nodes.HandL_2 && (
            <group
              name="HandL"
              position={[-0.003, 2.37, -0.021]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}
            >
              <skinnedMesh
                name="HandL_1"
                geometry={(nodes.HandL_1 as THREE.SkinnedMesh).geometry}
                material={materials.Main}
                skeleton={(nodes.HandL_1 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                name="HandL_2"
                geometry={(nodes.HandL_2 as THREE.SkinnedMesh).geometry}
                material={materials.Grey}
                skeleton={(nodes.HandL_2 as THREE.SkinnedMesh).skeleton}
              />
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/robot.glb");
