export type Dimensions = {
  width: number;
  height: number;
};

export type VVector = {
  xOffset: number;
  yOffset: number;
};

export type FontSize = Dimensions & {
  pointSize: number;
};

export type FontBoundingBox = Dimensions & VVector;

export type MetricsSet = 0 | 1 | 2;

export type Properties = Record<string, string | number>;

export type Character = {
  /**
   * In base fonts, this should correspond to the name in the PostScript
   * language outline font’s encoding vector. In a Composite font (Type 0), the
   * value may be a numeric offset or glyph ID.
   */
  name: string;
  /**
   * An integer representing the Adobe Standard Encoding value. If the character is not in the Adobe Standard Encoding, `encoding` is –1.
   */
  encoding: number;
  bitmap: number[];
  sWidth?: Dimensions;
  dWidth?: Dimensions;
  sWidth1?: Dimensions;
  dWidth1?: Dimensions;
  vVector?: VVector;
  bbx?: FontBoundingBox;
};

export type BDFFontOptions = {
  /**
   * The font name, which should exactly match the Post-Script™ language
   * FontName in the corresponding outline font program.
   */
  name: string;
  /**
   * The point size of the glyphs and the x and y resolutions of the device for
   * which the font is intended.
   */
  size: FontSize;
  /**
   * The width in x and the height in y, and the x and y displacement of the
   * lower left corner from origin 0 (for horizontal writing direction); all
   * in integer pixel values.
   */
  fontBoundingBox: FontBoundingBox;
  /** Optional comment for the font. Multiline comments will be split automatically. */
  comment?: string;
  /**
   * An integer which can be assigned by an installer program to keep track
   * of the version of the included data. The value is intended to be valid
   * only in a single environment, under the control of a single installer.
   * The value should only reflect upgrades to the quality of the bitmap images,
   * not to the glyph complement or encoding.
   */
  contentVersion?: number;
  /**
   * And integer corresponding to writing direction, which may be 0
   * (left-to-right only), 1 (right-to-left only), or 2 (both).
   *
   * The default is 0.
   *
   * If `metricsSet` is 1, `dWidth` and `sWidth` are optional.
   * WARN: for compatibility with version 2.1 these should only be set at the glyph level.
   */
  metricsSet?: MetricsSet;
  /**
   * An optional list of properties that can be used to store additional information about the font.
   */
  properties?: Record<string, string | number>;
  /**
   * An array of characters that make up the font. Each character is represented by a `Character` object.
   */
  characters?: Character[];
};

export class BDFFont {
  /** BDF version number */
  static STARTFONT = "2.1";
  comment?: string;
  contentVersion?: number;
  name: string;
  size: FontSize;
  fontBoundingBox: FontBoundingBox;
  metricsSet?: MetricsSet;
  properties?: Properties;
  characters: Character[] = [];

  constructor(options: BDFFontOptions) {
    this.name = options.name;
    this.comment = options.comment;
    this.contentVersion = options.contentVersion;
    this.properties = options.properties;

    const { size, fontBoundingBox } = options;

    if (
      size.width <= 0 ||
      !Number.isInteger(size.width) ||
      size.height <= 0 ||
      !Number.isInteger(size.height)
    ) {
      throw new Error(`Invalid point size: ${JSON.stringify(size)}`);
    }
    this.size = size;

    if (
      fontBoundingBox.width <= 0 ||
      !Number.isInteger(fontBoundingBox.width) ||
      fontBoundingBox.height <= 0 ||
      !Number.isInteger(fontBoundingBox.height) ||
      !Number.isInteger(fontBoundingBox.xOffset) ||
      !Number.isInteger(fontBoundingBox.yOffset)
    ) {
      throw new Error(
        `Invalid font bounding box: ${JSON.stringify(fontBoundingBox)}`,
      );
    }
    this.fontBoundingBox = fontBoundingBox;

    if (this.metricsSet !== undefined && ![0, 1, 2].includes(this.metricsSet)) {
      throw new Error(`Invalid metrics set: ${this.metricsSet}`);
    }
    this.metricsSet = options.metricsSet;

    if (options.characters) {
      options.characters.forEach((char) => this.addCharacter(char));
    }
  }

  validateCharacter(character: Character): void {
    if (character.encoding < -1 || !Number.isInteger(character.encoding)) {
      throw new Error(`Invalid character encoding: ${character.encoding}`);
    }
    if (!character.name || character.name.length > 14) {
      throw new Error(
        `Invalid character name: ${character.name} (${character.name.length}`,
      );
    }
    if (!character.bitmap || !Array.isArray(character.bitmap)) {
      throw new Error(`Invalid character bitmap: ${character.bitmap}`);
    }
    if (character.bbx) {
      const { width, height, xOffset, yOffset } = character.bbx;
      if (
        width <= 0 ||
        !Number.isInteger(width) ||
        height <= 0 ||
        !Number.isInteger(height) ||
        !Number.isInteger(xOffset) ||
        !Number.isInteger(yOffset)
      ) {
        throw new Error(
          `Invalid character bounding box: ${JSON.stringify(character.bbx)}`,
        );
      }
    }
  }

  addCharacter(character: Character): void {
    this.validateCharacter(character);
    this.characters.push(character);
  }

  toString(): string {
    const lines = [
      `STARTFONT ${BDFFont.STARTFONT}`,
      ...(this.comment
        ? this.comment
            .split("\n")
            .filter(Boolean)
            .map((c) => `COMMENT ${c}`)
        : []),
      ...(this.contentVersion ? [`CONTENTVERSION ${this.contentVersion}`] : []),
      `FONT ${this.name}`,
      `SIZE ${this.size.pointSize} ${this.size.width} ${this.size.height}`,
      `FONTBOUNDINGBOX ${this.fontBoundingBox.width} ${this.fontBoundingBox.height} ${this.fontBoundingBox.xOffset} ${this.fontBoundingBox.yOffset}`,
      `METRICSSET ${this.metricsSet ?? 0}`,
      ...(this.properties?.length
        ? [`STARTPROPERTIES ${this.properties.length}`]
            .concat(
              Object.entries(this.properties).map(
                ([key, value]) =>
                  `${key} ${typeof value === "string" ? `"${value}"` : value}`,
              ),
            )
            .concat(["ENDPROPERTIES"])
        : []),
      `CHARS ${this.characters.length}`,
      ...this.characters
        .map((char) => [
          `STARTCHAR ${char.name}`,
          `ENCODING ${char.encoding}`,
          char.sWidth
            ? `SWIDTH ${char.sWidth.width} ${char.sWidth.height}`
            : null,
          char.dWidth
            ? `DWIDTH ${char.dWidth.width} ${char.dWidth.height}`
            : null,
          char.sWidth1
            ? `SWIDTH1 ${char.sWidth1.width} ${char.sWidth1.height}`
            : null,
          char.dWidth1
            ? `DWIDTH1 ${char.dWidth1.width} ${char.dWidth1.height}`
            : null,
          char.vVector
            ? `VVECTOR ${char.vVector.xOffset} ${char.vVector.yOffset}`
            : null,
          char.bbx
            ? `BBX ${char.bbx.width} ${char.bbx.height} ${char.bbx.xOffset} ${char.bbx.yOffset}`
            : null,
          `BITMAP`,
          ...char.bitmap.map((row) =>
            row
              .toString(16)
              .toUpperCase()
              .padStart(Math.ceil(char.bbx?.width ?? 0 / 4), "0"),
          ),
          `ENDCHAR`,
        ])
        .flat(),
      `ENDFONT`,
    ];
    return lines.filter(Boolean).join("\n");
  }
}
