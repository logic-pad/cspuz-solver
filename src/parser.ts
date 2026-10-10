import { Puzzle } from '@logic-pad/core/data/puzzle.js';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers.js';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors.js';

export async function urlToPuzzle(url: string): Promise<Puzzle> {
  const value = decodeURIComponent(url).split('?d=')[1];
  const decompressed = await Compressor.decompress(value);
  return Serializer.parsePuzzle(decompressed);
}
