# ImageSpin

A TypeScript library for obfuscating images by "spinning" RGB values using key images. The process is reversible — spin forward to obfuscate, spin backward with the same key to reveal.

## Installation

```bash
npm install image-spin
```

Or install from a local `.tgz` file:

```bash
npm pack  # Creates image-spin-1.0.0.tgz
npm install ./image-spin-1.0.0.tgz
```

## Quick Start

```typescript
import { ImgSpin, ImageArray } from 'image-spin';

async function obfuscateImage() {
  // 1. Load an image as a pixel array (24-bit mode)
  const image = await ImageArray.getPixelArray('./my-image.jpg');
  const width = 300; // You must know/track the image width

  // 2. Create a spinner instance (24-bit mode)
  const spinner = new ImgSpin(0xFFFFFF);

  // 3. Generate a random key
  const key = spinner.createKey(image);

  // 4. Spin forward to obfuscate
  const obfuscated = spinner.spinImageForward(image, key);

  // 5. Save results as lossless BMP
  await ImageArray.savePixelArrayToImage(obfuscated, width, './obfuscated.bmp');
  await ImageArray.savePixelArrayToImage(key, width, './key.bmp');
}

async function revealImage() {
  // 1. Load the obfuscated image and key
  const obfuscated = await ImageArray.getPixelArray('./obfuscated.bmp');
  const key = await ImageArray.getPixelArray('./key.bmp');
  const width = 300;

  // 2. Create a spinner instance
  const spinner = new ImgSpin(0xFFFFFF);

  // 3. Spin backward to reveal
  const revealed = spinner.spinImageBackward(obfuscated, key);

  // 4. Save the result
  await ImageArray.savePixelArrayToImage(revealed, width, './revealed.bmp');
}
```

## API Reference

### `ImgSpin`

The core class for spinning pixel values.

| Constructor | Description |
|---|---|
| `new ImgSpin(mask)` | Creates a spinner. Use `0xFF` for 8-bit (per-channel) mode or `0xFFFFFF` for 24-bit (per-pixel) mode. |

| Method | Description |
|---|---|
| `spinImageForward(image, key)` | Obfuscates an image array using a key array. |
| `spinImageBackward(image, key)` | Reveals an obfuscated image using the original key. |
| `createKey(image)` | Generates a random key array matching the image length. |

### `ImageArray`

Utility class for loading and saving images.

| Method | Description |
|---|---|
| `ImageArray.getPixelArray(path)` | Loads an image and returns a 24-bit pixel array (`number[]`). |
| `ImageArray.savePixelArrayToImage(pixels, width, path)` | Saves a 24-bit pixel array to a BMP image. |
| `ImageArray.getRGBArray(path)` | Loads an image and returns an 8-bit RGB array (R, G, B, R, G, B...). |
| `ImageArray.saveRGBArrayToImage(rgb, width, path)` | Saves an 8-bit RGB array to a BMP image. |

## Modes

### 24-bit Mode (Recommended)

Each pixel's RGB value is treated as a single 24-bit integer. This is **3x faster** and creates stronger obfuscation due to channel entanglement.

```typescript
const spinner = new ImgSpin(0xFFFFFF);
```

### 8-bit Mode

Each color channel (R, G, B) is processed individually. Use `getRGBArray` and `saveRGBArrayToImage` with this mode.

```typescript
const spinner = new ImgSpin(0xFF);
```

## Important Notes

1.  **Use BMP format**: Always save obfuscated images and keys as `.bmp`. Lossy formats like JPEG will corrupt the data and make decoding impossible.
2.  **Track image width**: The library requires you to specify the image width when saving. Store this metadata alongside your files.
3.  **Key security**: The default `createKey` uses `Math.random()`. For production use, consider a cryptographically secure random source.

## How It Works

The algorithm performs modular addition/subtraction on pixel values:

-   **Forward (Obfuscate)**: `result = (pixel + key) & mask`
-   **Backward (Reveal)**: `result = (pixel - key) & mask`

Because the operation is symmetric, you can chain multiple keys and remove them in any order.

## Test Images

The test suite uses these Creative Commons images from Pixabay:

-   [Test image 1 - Puffin](https://pixabay.com/photos/puffin-bird-fish-meal-animal-beak-8372701/)
-   [Test image 2 - Mountain River](https://pixabay.com/pl/photos/g%C3%B3ra-rzeka-potok-sceniczny-natura-8517546/)
-   [Test image 3 - Alps](https://pixabay.com/pl/photos/g%C3%B3ra-alpy-wzg%C3%B3rza-dolina-6253669/)
-   [Test image 4 - Bluets](https://pixabay.com/pl/photos/bluets-g%C3%B3rski-wieloletnie-chabry-3440640/)

## License

MIT License

Copyright (c) Ashley Peake

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

