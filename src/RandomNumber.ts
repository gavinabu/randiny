import RNG, {RNGCapture} from "./RNG";

export default class RandomNumber {
  private readonly capturedRNG: RNGCapture;
  constructor(private readonly rng: RNG, private readonly value: number) {
    this.capturedRNG = rng.capture();
  }
  
  get() {
    return this.value;
  }
  
  getRNG() {
    return this.rng;
  }
  
  getCapturedRNG() {
    return this.capturedRNG;
  }
}