import type { Node } from '@xyflow/react';

export type VoronoiCollisionOptions = {
  maxIterations: number;
  overlapThreshold: number;
  margin: number;
  noiseScale?: number;
  repulsionStrength?: number;
  damping?: number;
  useSpatialPartitioning?: boolean;
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
  vx: number;
  vy: number;
  moved: boolean;
  node: Node;
};

type SpatialGrid = Map<string, Box[]>;

// Simple hash function for pseudo-random noise
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return (h ^ (h >>> 16)) / 2147483648 + 0.5;
}

// Cache for Voronoi noise calculations
const noiseCache = new Map<string, { dx: number; dy: number }>();

// Voronoi-inspired noise function with caching
function voronoiNoise(x: number, y: number, scale: number): { dx: number; dy: number } {
  const cellSize = scale;
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  
  const cacheKey = `${cellX},${cellY}`;
  const cached = noiseCache.get(cacheKey);
  if (cached) return cached;
  
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
  let result: { dx: number; dy: number };
  
  if (dist > 0) {
    result = {
      dx: closestX / dist,
      dy: closestY / dist,
    };
  } else {
    result = { dx: 0, dy: 0 };
  }
  
  noiseCache.set(cacheKey, result);
  return result;
}

// Spatial partitioning for broad-phase collision detection
function createSpatialGrid(boxes: Box[], cellSize: number): SpatialGrid {
  const grid: SpatialGrid = new Map();
  
  for (const box of boxes) {
    const minX = Math.floor(box.x / cellSize);
    const minY = Math.floor(box.y / cellSize);
    const maxX = Math.floor((box.x + box.width) / cellSize);
    const maxY = Math.floor((box.y + box.height) / cellSize);
    
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        const cell = grid.get(key);
        if (cell) {
          cell.push(box);
        } else {
          grid.set(key, [box]);
        }
      }
    }
  }
  
  return grid;
}

function getPotentialCollisions(box: Box, grid: SpatialGrid, cellSize: number): Box[] {
  const minX = Math.floor(box.x / cellSize);
  const minY = Math.floor(box.y / cellSize);
  const maxX = Math.floor((box.x + box.width) / cellSize);
  const maxY = Math.floor((box.y + box.height) / cellSize);
  
  const potential = new Set<Box>();
  
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const key = `${x},${y}`;
      const cell = grid.get(key);
      if (cell) {
        for (const other of cell) {
          if (other !== box) {
            potential.add(other);
          }
        }
      }
    }
  }
  
  return Array.from(potential);
}

function getBoxesFromNodes(nodes: Node[], margin: number = 0): Box[] {
  const boxes: Box[] = new Array(nodes.length);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    boxes[i] = {
      x: node.position.x - margin,
      y: node.position.y - margin,
      width: (node.width ?? node.measured?.width ?? 200) + margin * 2,
      height: (node.height ?? node.measured?.height ?? 60) + margin * 2,
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
    noiseScale = 150,
    repulsionStrength = 0.5,
    damping = 0.85,
    useSpatialPartitioning = true,
  },
) => {
  const boxes = getBoxesFromNodes(nodes, margin);
  
  // Clear noise cache periodically to prevent memory buildup
  if (noiseCache.size > 1000) {
    noiseCache.clear();
  }
  
  // Calculate average box size for spatial grid
  const avgSize = boxes.reduce((sum, box) => sum + Math.max(box.width, box.height), 0) / boxes.length;
  const gridCellSize = avgSize * 2;

  for (let iter = 0; iter < maxIterations; iter++) {
    let moved = false;
    let maxVelocity = 0;

    // Apply damping
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].vx *= damping;
      boxes[i].vy *= damping;
    }

    // Build spatial grid for this iteration if enabled
    const spatialGrid = useSpatialPartitioning ? createSpatialGrid(boxes, gridCellSize) : null;

    // Apply collision repulsion with Voronoi noise
    for (let i = 0; i < boxes.length; i++) {
      const A = boxes[i];
      const centerAX = A.x + A.width * 0.5;
      const centerAY = A.y + A.height * 0.5;

      // Get potential collisions using spatial partitioning or brute force
      const candidates = spatialGrid 
        ? getPotentialCollisions(A, spatialGrid, gridCellSize)
        : boxes.slice(i + 1);

      for (const B of candidates) {
        if (B === A) continue;
        
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

          // Calculate repulsion force (avoid sqrt when possible)
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const minDist = Math.max(1, dist);
          
          // Base repulsion
          const repulsion = Math.min(px, py) * repulsionStrength;
          let forceX = (dx / minDist) * repulsion;
          let forceY = (dy / minDist) * repulsion;

          // Add subtle Voronoi noise influence
          const noiseA = voronoiNoise(centerAX, centerAY, noiseScale);
          const noiseB = voronoiNoise(centerBX, centerBY, noiseScale);
          
          const noiseInfluence = 0.3;
          forceX += noiseA.dx * noiseInfluence;
          forceY += noiseA.dy * noiseInfluence;
          
          // Apply forces
          A.vx += forceX;
          A.vy += forceY;
          B.vx -= forceX - noiseB.dx * noiseInfluence;
          B.vy -= forceY - noiseB.dy * noiseInfluence;
        }
      }
    }

    // Update positions based on velocities
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      box.x += box.vx;
      box.y += box.vy;
      
      // Track max velocity for early exit
      const velMag = Math.abs(box.vx) + Math.abs(box.vy);
      if (velMag > maxVelocity) {
        maxVelocity = velMag;
      }
    }

    // Early exit if no overlaps were found or movement is negligible
    if (!moved || maxVelocity < 0.01) {
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