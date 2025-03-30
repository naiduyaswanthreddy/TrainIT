
/**
 * Utility functions for interacting with IPFS
 */

// Simulate IPFS content storage
// In a real application, this would connect to an actual IPFS node or service like Pinata, Infura, etc.
export const storeOnIPFS = async (content: string | File): Promise<string> => {
  try {
    // Mock IPFS storage for demonstration
    // In a real app, you'd use a library like ipfs-http-client or a service API
    
    // Generate a mock IPFS hash (CID)
    const mockCID = generateMockCID();
    
    // In production, this would be the actual IPFS gateway URL
    return `ipfs://${mockCID}`;
  } catch (error) {
    console.error('Error storing content on IPFS:', error);
    throw new Error('Failed to store content on IPFS');
  }
};

// Store JSON metadata on IPFS (for NFTs)
export const storeNFTMetadataOnIPFS = async (metadata: any): Promise<string> => {
  try {
    // Convert metadata to JSON string
    const metadataString = JSON.stringify(metadata);
    
    // Store the metadata on IPFS
    return await storeOnIPFS(metadataString);
  } catch (error) {
    console.error('Error storing NFT metadata on IPFS:', error);
    throw new Error('Failed to store NFT metadata on IPFS');
  }
};

// Store an image file on IPFS
export const storeImageOnIPFS = async (imageFile: File): Promise<string> => {
  try {
    // Store the image on IPFS
    return await storeOnIPFS(imageFile);
  } catch (error) {
    console.error('Error storing image on IPFS:', error);
    throw new Error('Failed to store image on IPFS');
  }
};

// Convert a Base64 data URL to a File object
export const dataURLtoFile = (dataURL: string, filename: string): File => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

// Generate a mock IPFS CID
const generateMockCID = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Qm';
  for (let i = 0; i < 44; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Get the URL for an IPFS resource that can be accessed through a gateway
export const getIPFSGatewayURL = (ipfsURI: string): string => {
  // Replace ipfs:// with the gateway URL
  // For demo purposes, we'll use a public gateway
  if (ipfsURI.startsWith('ipfs://')) {
    return ipfsURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return ipfsURI;
};
