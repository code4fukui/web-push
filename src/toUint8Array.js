export const toUint8Array = (buffer) => {
  const res = new Uint8Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    res[i] = buffer[i];
  }
  return res;
};
