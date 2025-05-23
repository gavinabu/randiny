import RNG from "./RNG";
import RandomNumber from "./RandomNumber";

export class StaticMap1D {
  private readonly map: RandomNumber[];
  constructor(rng: RNG, length: number) {
    this.map = new Array(length).fill(0).map(e => rng.nextValue());
  }
  
  get(index: number) {
    return this.map[index];
  }
  
  /**
   * Get a range of the map
   * @param start Start of the range you want to find. Inclusive
   * @param end End of the range you want to find. Inclusive
   */
  getRange(start: number, end: number) {
    this.map.slice(start, (end-start)+1);
  }
  
  getFullMap() {
    return this.map;
  }
}

export class StaticMap2D {
  private readonly map: RandomNumber[][];
  constructor(rng: RNG, width: number, height: number) {
    this.map = new Array(height).fill(0).map(e => new Array(width).fill(0).map(e => rng.nextValue()));
  }
  
  get(x: number, y: number) {
    return this.map[y][x];
  }
  
  getRow(y: number) {
    return this.map[y];
  }
  
  getCol(x: number): RandomNumber[] {
    const newArr: RandomNumber[] = [];
    this.map.forEach((row) => {
      newArr.push(row[x]);
    })
    return newArr;
  }
  
  /**
   * Returns a yx array of rows like this.\
   * [row,row,row]
   */
  getFullMap() {
    return this.map;
  }
}

export class StaticMap3D {
  private readonly map: RandomNumber[][][];
  constructor(rng: RNG, width: number, height: number, depth: number) {
    this.map = new Array(height).fill(0).map(e => new Array(width).fill(0).map(e => new Array(depth).fill(0).map(e => rng.nextValue())));
  }
  
  get(x: number, y: number, z: number) {
    return this.map[y][x][z];
  }
  
  getRow(y: number) {
    return this.map[y];
  }
  
  getCol(x: number): RandomNumber[][] {
    const newArr: RandomNumber[][] = [];
    this.map.forEach((row) => {
      newArr.push(row[x]);
    })
    return newArr;
  }
  
  getDepths(x: number, y: number) {
    return this.map[y][x];
  }
  
  /**
   * Returns a yx array of columns like this.\
   * [row,row,row]\
   * each row like this
   * [depths,depths,depths]
   */
  getFullMap() {
    return this.map;
  }
}