import RNG from "./RNG";
import RandomNumber from "./RandomNumber";
import {createNoise2D, createNoise3D} from "./SimplexNoise";

export class SimplexMap2D {
  private readonly map: RandomNumber[][];
  
  constructor(rng: RNG, width: number, height: number) {
    const noise = createNoise2D(rng);
    this.map = new Array(height).fill(new Array(width).fill(0)).map((e,y) => e.map((_: any, x: number) => noise(x,y)))
  }
  
  get(x: number, y: number) {
    return this.map[y][x];
  }
  
  getRow(y: number) {
    return this.map[y];
  }
  
  getCol(x: number): RandomNumber[] {
    return this.map.map(row => row[x]);
  }
  
  getFullMap() {
    return this.map;
  }
}

export class SimplexMap3D {
  private readonly map: RandomNumber[][][];
  
  constructor(rng: RNG, width: number, height: number, depth: number) {
    const noise = createNoise3D(rng);
    this.map = new Array(height).fill(new Array(width).fill(new Array(depth).fill(0))).map((e,y) => e.map((e2: any, x: number) => e2.map((_: any, z: number) => noise(x,y,z))))
  }
  
  get(x: number, y: number, z: number) {
    return this.map[y][x][z];
  }
  
  getRow(y: number) {
    return this.map[y];
  }
  
  getCol(x: number): RandomNumber[][] {
    return this.map.map(row => row[x]);
  }
  
  getDepths(x: number, y: number) {
    return this.map[y][x];
  }
  
  getFullMap() {
    return this.map;
  }
}
