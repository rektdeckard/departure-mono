declare module "glslCanvas" {
  export type TestResult = {
    wasValid: boolean;
    frag: string;
    vert: string;
    timeElapsedMs: number;
  };

  export default class GlslCanvas {
    constructor(canvas: HTMLCanvasElement, contextOptions?: {}, options?: {});
    destroy();
    load(fragString: string);
    load(fragString: string, vertString: string);
    test(
      callback: (r: TestResult) => void,
      fragString: string,
      vertString: string,
    );
    loadTexture(
      name: string,
      urlElementOrData: string | URL | ImageData,
      options: any,
    );
    uniform(method: string, type: string, name: string, ...value: any[]);
    uniformTexture(name: string, texture, options);
    setUniform(name: string, ...value: any[]);
    setUniforms(uniforms: any[]);
    refreshUniforms();
    setMouse(mouse: MouseEvent | { x: number; y: number });
  }
}
