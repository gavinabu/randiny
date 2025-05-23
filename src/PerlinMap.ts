import RNG from "./RNG";
import RandomNumber from "./RandomNumber";

export class PerlinMap1D {
  private readonly map: RandomNumber[];
  
  constructor(rng: RNG, length: number, options?: {
    frequency?: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
  }) {
    const { frequency = 0.01, octaves = 4, lacunarity = 2, gain = 0.5 } = options ?? {};
    this.map = Array.from({ length }, (_, x) =>
      rng.fbm1D(x, octaves, frequency, lacunarity, gain)
    );
  }
  
  get(index: number) {
    return this.map[index];
  }
  
  getRange(start: number, end: number) {
    return this.map.slice(start, end + 1);
  }
  
  getFullMap() {
    return this.map;
  }
}


export class PerlinMap2D {
  private readonly map: RandomNumber[][];
  
  constructor(rng: RNG, width: number, height: number, options?: {
    frequency?: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
  }) {
    const { frequency = 0.01, octaves = 4, lacunarity = 2, gain = 0.5 } = options ?? {};
    this.map = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) =>
        rng.fbm2D(x, y, octaves, frequency, lacunarity, gain)
      )
    );
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

export class PerlinMap3D {
  private readonly map: RandomNumber[][][];
  
  constructor(rng: RNG, width: number, height: number, depth: number, options?: {
    frequency?: number;
    octaves?: number;
    lacunarity?: number;
    gain?: number;
  }) {
    const { frequency = 0.01, octaves = 4, lacunarity = 2, gain = 0.5 } = options ?? {};
    this.map = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) =>
        Array.from({ length: depth }, (_, z) =>
          rng.fbm3D(x, y, z, octaves, frequency, lacunarity, gain)
        )
      )
    );
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
