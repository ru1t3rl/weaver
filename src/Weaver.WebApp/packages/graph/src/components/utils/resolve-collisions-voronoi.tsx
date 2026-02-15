import type { Node } from '@xyflow/react';

export type VoronoiCollisionOptions = {
  maxIterations: number;
  overlapThreshold: number;
  margin: number;
  noiseScale?: number;
  repulsionStrength?: number;
  damping?: number;
};

export type CollisionAlgorithm = (
  nodes: Node[],
  options: VoronoiCollisionOptions,
) => Node[];

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number; // velocity x
  vy: number; // velocity y
  moved: boolean;
  node: Node;
};

// Simple hash function for pseudo-random noise
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) / 2147483648 + 0.5;
}

// Voronoi-inspired noise function
function voronoiNoise(x: number, y: number, scale: number): { dx: number; dy: number } {
  const cellSize = scale;
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  
  let minDist = Infinity;
  let closestX = 0;
  let closestY = 0;
  
  // Check neighboring cells for Voronoi points
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const neighborX = cellX + i;
      const neighborY = cellY + j;
      
      // Generate pseudo-random point in this cell
      const pointX = (neighborX + hash(neighborX, neighborY)) * cellSize;
      const pointY = (neighborY + hash(neighborY, neighborX)) * cellSize;
      
      const dx = x - pointX;
      const dy = y - pointY;
      const dist = dx * dx + dy * dy;
      
      if (dist < minDist) {
        minDist = dist;
        closestX = dx;
        closestY = dy;
      }
    }
  }
  
  // Return normalized direction away from closest Voronoi point
  const dist = Math.sqrt(closestX * closestX + closestY * closestY);
  if (dist > 0) {
    return {
      dx: closestX / dist,
      dy: closestY / dist,
    };
  }
  
  return { dx: 0, dy: 0 };
}

function getBoxesFromNodes(nodes: Node[], margin: number = 0): Box[] {
  const boxes: Box[] = new Array(nodes.length);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    boxes[i] = {
      x: node.position.x - margin,
      y: node.position.y - margin,
      width: (node.width ?? node.measured?.width ?? 0) + margin * 2,
      height: (node.height ?? node.measured?.height ?? 0) + margin * 2,
      vx: 0,
      vy: 0,
      node,
      moved: false,
    };
  }

  return boxes;
}

export const resolveCollisionsVoronoi: CollisionAlgorithm = (
  nodes,
  { 
    maxIterations = 50, 
    overlapThreshold = 0.5, 
    margin = 0,
    noiseScale = 200,
    repulsionStrength = 1.0,
    damping = 0.8,
  },
) => {
  const boxes = getBoxesFromNodes(nodes, margin);

  for (let iter = 0; iter < maxIterations; iter++) {
    let moved = false;

    // Reset forces
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].vx *= damping;
      boxes[i].vy *= damping;
    }

    // Apply collision repulsion with Voronoi noise
    for (let i = 0; i < boxes.length; i++) {
      const A = boxes[i];
      const centerAX = A.x + A.width * 0.5;
      const centerAY = A.y + A.height * 0.5;

      for (let j = i + 1; j < boxes.length; j++) {
        const B = boxes[j];
        const centerBX = B.x + B.width * 0.5;
        const centerBY = B.y + B.height * 0.5;

        // Calculate distance between centers
        const dx = centerAX - centerBX;
        const dy = centerAY - centerBY;

        // Calculate overlap along each axis
        const px = (A.width + B.width) * 0.5 - Math.abs(dx);
        const py = (A.height + B.height) * 0.5 - Math.abs(dy);

        // Check if there's overlap
        if (px > overlapThreshold && py > overlapThreshold) {
          moved = true;
          A.moved = B.moved = true;

          // Calculate repulsion force
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = Math.max(1, distance);
          
          // Base repulsion
          let forceX = (dx / minDist) * px * repulsionStrength;
          let forceY = (dy / minDist) * py * repulsionStrength;

          // Add Voronoi noise influence
          const noiseA = voronoiNoise(centerAX, centerAY, noiseScale);
          const noiseB = voronoiNoise(centerBX, centerBY, noiseScale);
          
          forceX += noiseA.dx * 2;
          forceY += noiseA.dy * 2;
          
          // Apply forces
          A.vx += forceX;
          A.vy += forceY;
          B.vx -= forceX - noiseB.dx * 2;
          B.vy -= forceY - noiseB.dy * 2;
        }
      }
    }

    // Update positions based on velocities
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      box.x += box.vx;
      box.y += box.vy;
    }

    // Early exit if no overlaps were found
    if (!moved) {
      break;
    }
  }

  const newNodes = boxes.map((box) => {
    if (box.moved) {
      return {
        ...box.node,
        position: {
          x: box.x + margin,
          y: box.y + margin,
        },
      };
    }
    return box.node;
  });

  return newNodes;
};