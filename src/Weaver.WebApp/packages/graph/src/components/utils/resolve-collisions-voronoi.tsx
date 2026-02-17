import type { Node, Edge } from '@xyflow/react';

export type VoronoiCollisionOptions = {
  maxIterations: number;
  overlapThreshold: number;
  margin: number;
  noiseScale?: number;
  repulsionStrength?: number;
  damping?: number;
  useSpatialPartitioning?: boolean;
  layerSeparation?: number;
};

export type CollisionAlgorithm = (
  nodes: Node[],
  edges: Edge[],
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
  layer: number; // Which layer this node belongs to
  targetY: number; // Target Y position based on layer
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

// Assign layers to nodes based on edges
function assignLayers(nodes: Node[], edges: Edge[]): Map<string, number> {
  const layers = new Map<string, number>();
  const hasIncoming = new Set<string>();
  const hasOutgoing = new Set<string>();
  
  // Track which nodes have incoming/outgoing edges
  for (const edge of edges) {
    hasIncoming.add(edge.target);
    hasOutgoing.add(edge.source);
  }
  
  // Assign layers:
  // Layer 0: Only sources (no incoming edges)
  // Layer 1: Middle nodes (both incoming and outgoing)
  // Layer 2: Only targets (no outgoing edges)
  for (const node of nodes) {
    const incoming = hasIncoming.has(node.id);
    const outgoing = hasOutgoing.has(node.id);
    
    if (!incoming && !outgoing) {
      // Isolated node - put in middle
      layers.set(node.id, 1);
    } else if (!incoming && outgoing) {
      // Source only - top layer
      layers.set(node.id, 0);
    } else if (incoming && !outgoing) {
      // Target only - bottom layer
      layers.set(node.id, 2);
    } else {
      // Both - middle layer
      layers.set(node.id, 1);
    }
  }
  
  return layers;
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

function getBoxesFromNodes(nodes: Node[], edges: Edge[], margin: number, layerSeparation: number): Box[] {
  if (nodes.length === 0) {
    return [];
  }
  
  const boxes: Box[] = new Array(nodes.length);
  const layers = assignLayers(nodes, edges);
  
  // Calculate bounding box to determine layer positions
  let minY = Infinity;
  let maxY = -Infinity;
  
  for (const node of nodes) {
    const y = node.position?.y ?? 0;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  
  // Handle edge cases
  if (!isFinite(minY)) minY = 0;
  if (!isFinite(maxY)) maxY = 0;
  
  const totalHeight = maxY - minY;
  const layerHeight = totalHeight > 0 ? totalHeight / 3 : layerSeparation;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const layer = layers.get(node.id) ?? 1;
    
    // Calculate target Y based on layer
    const targetY = minY + layer * (layerHeight + layerSeparation);
    
    // Ensure valid positions
    const nodeX = node.position?.x ?? 0;
    const nodeY = node.position?.y ?? 0;
    const nodeWidth = node.width ?? node.measured?.width ?? 100;
    const nodeHeight = node.height ?? node.measured?.height ?? 100;
    
    boxes[i] = {
      x: nodeX - margin,
      y: nodeY - margin,
      width: nodeWidth + margin * 2,
      height: nodeHeight + margin * 2,
      vx: 0,
      vy: 0,
      node,
      moved: false,
      layer,
      targetY: isFinite(targetY) ? targetY : nodeY,
    };
  }

  return boxes;
}

export const resolveCollisionsVoronoi: CollisionAlgorithm = (
  nodes,
  edges,
  { 
    maxIterations = 50, 
    overlapThreshold = 0.5, 
    margin = 0,
    noiseScale = 150,
    repulsionStrength = 0.5,
    damping = 0.85,
    useSpatialPartitioning = true,
    layerSeparation = 200,
  },
) => {
  // Validate inputs
  if (!nodes || nodes.length === 0) {
    return [];
  }
  
  if (!edges) {
    edges = [];
  }
  
  const boxes = getBoxesFromNodes(nodes, edges, margin, layerSeparation);
  
  if (boxes.length === 0) {
    return nodes;
  }
  
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

      // Apply gentle force toward target Y layer
      const layerForce = (A.targetY - centerAY) * 0.05;
      A.vy += layerForce;
      
      // Add Voronoi noise for organic horizontal distribution
      const noise = voronoiNoise(centerAX, centerAY, noiseScale);
      A.vx += noise.dx * 0.2; // Horizontal variation
      // Don't add vertical noise to maintain layers

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

          // Calculate repulsion force
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const minDist = Math.max(1, dist);
          
          // Base repulsion
          const repulsion = Math.min(px, py) * repulsionStrength;
          let forceX = (dx / minDist) * repulsion;
          let forceY = (dy / minDist) * repulsion;

          // If nodes are in different layers, prefer horizontal separation
          if (A.layer !== B.layer) {
            forceX *= 1.5; // Strengthen horizontal repulsion
            forceY *= 0.5; // Weaken vertical repulsion to maintain layers
          }

          // Add Voronoi noise influence for organic spacing
          const noiseA = voronoiNoise(centerAX, centerAY, noiseScale);
          const noiseB = voronoiNoise(centerBX, centerBY, noiseScale);
          
          // Apply noise primarily in horizontal direction to maintain layers
          const noiseInfluenceX = 0.4;
          const noiseInfluenceY = 0.1; // Much smaller vertical influence
          forceX += noiseA.dx * noiseInfluenceX;
          forceY += noiseA.dy * noiseInfluenceY;
          
          // Apply forces
          A.vx += forceX;
          A.vy += forceY;
          B.vx -= forceX - noiseB.dx * noiseInfluenceX;
          B.vy -= forceY - noiseB.dy * noiseInfluenceY;
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