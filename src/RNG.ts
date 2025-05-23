import RandomNumber from "./RandomNumber";

export interface RNGCapture {
  seed: number;
  rollingseed: number;
}

export default class RNG {
  private rollingseed: number;
  
  constructor(public readonly seed: number) {
    this.rollingseed = this.seed;
  }
  
  /**
   * Returns a pseudo-random number between 0-1. As a RandomNumber class.
   */
  public nextValue() {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    
    this.rollingseed = (a * this.rollingseed + c) % m;
    return new RandomNumber(this, this.rollingseed / m);
  }
  
  /**
    Returns a static capture of the RNG configuration.
   */
  public capture(): RNGCapture {
    return {
      seed: this.seed,
      rollingseed: this.rollingseed,
    }
  }
  
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, ...coords: number[]): number {
    switch (coords.length) {
      case 1: {
        const x = coords[0];
        return (hash & 1) === 0 ? x : -x;
      }
      case 2: {
        const [x, y] = coords;
        const h = hash & 7;
        switch (h) {
          case 0: return  x + y;
          case 1: return -x + y;
          case 2: return  x - y;
          case 3: return -x - y;
          case 4: return  x;
          case 5: return -x;
          case 6: return  y;
          case 7: return -y;
        }
        return 0;
      }
      case 3: {
        const [x, y, z] = coords;
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
      }
      default:
        throw new Error("Invalid dimension for grad()");
    }
  }
  
  private hash(...coords: number[]): number {
    let h = this.seed >>> 0;
    
    for (let i = 0; i < coords.length; i++) {
      let k = (coords[i] + i * 374761393) >>> 0;
      k *= 0xcc9e2d51;
      k = (k << 15) | (k >>> 17);
      k *= 0x1b873593;
      
      h ^= k;
      h = (h << 13) | (h >>> 19);
      h = h * 5 + 0xe6546b64;
    }
    
    h ^= coords.length * 4;
    h ^= h >>> 16;
    h *= 0x85ebca6b;
    h ^= h >>> 13;
    h *= 0xc2b2ae35;
    h ^= h >>> 16;
    
    return h & 255;
  }
  
  
  
  public perlin1D(x: number): RandomNumber {
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const sx = this.fade(x - x0);
    
    const n0 = this.grad(this.hash(x0), x - x0);
    const n1 = this.grad(this.hash(x1), x - x1);
    
    const value = this.lerp(n0, n1, sx);
    return new RandomNumber(this, (value + 1) / 2); // normalize to [0,1]
  }
  
  public perlin2D(x: number, y: number): RandomNumber {
    const x0 = Math.floor(x), x1 = x0 + 1;
    const y0 = Math.floor(y), y1 = y0 + 1;
    
    const sx = this.fade(x - x0);
    const sy = this.fade(y - y0);
    
    const n00 = this.grad(this.hash(x0, y0), x - x0, y - y0);
    const n10 = this.grad(this.hash(x1, y0), x - x1, y - y0);
    const n01 = this.grad(this.hash(x0, y1), x - x0, y - y1);
    const n11 = this.grad(this.hash(x1, y1), x - x1, y - y1);
    
    const ix0 = this.lerp(n00, n10, sx);
    const ix1 = this.lerp(n01, n11, sx);
    const value = this.lerp(ix0, ix1, sy);
    
    return new RandomNumber(this, (value + 1) / 2);
  }
  
  public perlin3D(x: number, y: number, z: number): RandomNumber {
    const x0 = Math.floor(x), x1 = x0 + 1;
    const y0 = Math.floor(y), y1 = y0 + 1;
    const z0 = Math.floor(z), z1 = z0 + 1;
    
    const sx = this.fade(x - x0);
    const sy = this.fade(y - y0);
    const sz = this.fade(z - z0);
    
    const n000 = this.grad(this.hash(x0, y0, z0), x - x0, y - y0, z - z0);
    const n100 = this.grad(this.hash(x1, y0, z0), x - x1, y - y0, z - z0);
    const n010 = this.grad(this.hash(x0, y1, z0), x - x0, y - y1, z - z0);
    const n110 = this.grad(this.hash(x1, y1, z0), x - x1, y - y1, z - z0);
    const n001 = this.grad(this.hash(x0, y0, z1), x - x0, y - y0, z - z1);
    const n101 = this.grad(this.hash(x1, y0, z1), x - x1, y - y0, z - z1);
    const n011 = this.grad(this.hash(x0, y1, z1), x - x0, y - y1, z - z1);
    const n111 = this.grad(this.hash(x1, y1, z1), x - x1, y - y1, z - z1);
    
    const ix00 = this.lerp(n000, n100, sx);
    const ix01 = this.lerp(n001, n101, sx);
    const ix10 = this.lerp(n010, n110, sx);
    const ix11 = this.lerp(n011, n111, sx);
    
    const iy0 = this.lerp(ix00, ix10, sy);
    const iy1 = this.lerp(ix01, ix11, sy);
    
    const value = this.lerp(iy0, iy1, sz);
    return new RandomNumber(this, (value + 1) / 2);
  }
  
  public fbm1D(x: number, octaves = 4, frequency = 0.01, lacunarity = 2, gain = 0.5): RandomNumber {
    let total = 0;
    let amp = 1;
    let freq = frequency;
    let max = 0;
    
    for (let i = 0; i < octaves; i++) {
      total += this.perlin1D(x * freq).get() * amp;
      max += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    
    return new RandomNumber(this, total / max);
  }
  
  public fbm2D(x: number, y: number, octaves = 4, frequency = 0.01, lacunarity = 2, gain = 0.5): RandomNumber {
    let total = 0;
    let amp = 1;
    let freq = frequency;
    let max = 0;
    
    for (let i = 0; i < octaves; i++) {
      total += this.perlin2D(x * freq, y * freq).get() * amp;
      max += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    
    return new RandomNumber(this, total / max);
  }
  
  public fbm3D(x: number, y: number, z: number, octaves = 4, frequency = 0.01, lacunarity = 2, gain = 0.5): RandomNumber {
    let total = 0;
    let amp = 1;
    let freq = frequency;
    let max = 0;
    
    for (let i = 0; i < octaves; i++) {
      total += this.perlin3D(x * freq, y * freq, z * freq).get() * amp;
      max += amp;
      amp *= gain;
      freq *= lacunarity;
    }
    
    return new RandomNumber(this, total / max);
  }
}