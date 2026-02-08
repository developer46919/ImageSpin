import fs from 'fs';
import Jimp from 'jimp';

/**
 * Utility to load images from disk and convert them to RGB arrays
 * and convert RGB arrays to images and save them to disk
 */
export class ImageArray {
    /**
     * Open an image from a file path and convert it to an RGB array
     * 
     * @param path path to the image file
     */
    static async getRGBArray(path: string): Promise<number[]> {
        // Read the image
        const image = await Jimp.read(path);
        const data = image.bitmap.data; // Direct access to RGBA buffer
        const pixelCount = image.bitmap.width * image.bitmap.height;
        const rgbArray = new Array(pixelCount * 3);

        // Directly read from bitmap buffer (RGBA format, 4 bytes per pixel)
        for (let i = 0, j = 0; i < pixelCount; i++) {
            const offset = i * 4;
            rgbArray[j++] = data[offset];     // R
            rgbArray[j++] = data[offset + 1]; // G
            rgbArray[j++] = data[offset + 2]; // B
        }

        return rgbArray;
    }
    
    /**
     * Convert an RGB array to an image and save it to disk
     */
    static async saveRGBArrayToImage(rgbArray: number[], width: number, path: string) {
        const height = rgbArray.length / (width * 3);
        // Create a new image
        const image = new Jimp(width, height);
        const data = image.bitmap.data;

        // Directly write to bitmap buffer (RGBA format, 4 bytes per pixel)
        const pixelCount = width * height;
        for (let i = 0, j = 0; i < pixelCount; i++) {
            const offset = i * 4;
            data[offset] = rgbArray[j++];     // R
            data[offset + 1] = rgbArray[j++]; // G
            data[offset + 2] = rgbArray[j++]; // B
            data[offset + 3] = 255;           // A
        }

        // Save the image to disk
        await image.writeAsync(path);
    }
    
    /**
     * Get a Pixel array with RGB colors in 24 bit integers
     * alpha channel is removed
     */
    static async getPixelArray(path:string): Promise<number[]> {
        // Read the image
        const image = await Jimp.read(path);
        const data = image.bitmap.data; // Direct access to RGBA buffer
        const pixelCount = image.bitmap.width * image.bitmap.height;
        const pixelArray = new Array(pixelCount);

        // Directly read from bitmap buffer (RGBA format, 4 bytes per pixel)
        for (let i = 0; i < pixelCount; i++) {
            const offset = i * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            pixelArray[i] = (r << 16) + (g << 8) + b;
        }

        return pixelArray;
    }
    
    /**
     * Convert a RGB pixel array to an image and save it to disk
     */
    static async savePixelArrayToImage(pixelArray: number[], width: number, path: string) {
        const height = pixelArray.length / width;
        // Create a new image
        const image = new Jimp(width, height);
        const data = image.bitmap.data;

        // Directly write to bitmap buffer (RGBA format, 4 bytes per pixel)
        for (let i = 0; i < pixelArray.length; i++) {
            const pixelColor = pixelArray[i];
            const offset = i * 4;
            data[offset] = (pixelColor >> 16) & 0xFF;     // R
            data[offset + 1] = (pixelColor >> 8) & 0xFF;  // G
            data[offset + 2] = pixelColor & 0xFF;         // B
            data[offset + 3] = 255;                       // A
        }

        // Save the image to disk
        await image.writeAsync(path);
    }       
}