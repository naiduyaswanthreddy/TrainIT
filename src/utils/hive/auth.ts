
// Authentication utilities for Hive blockchain

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('connectedUser') !== null;
};

// Get the connected username
export const getConnectedUsername = (): string | null => {
  return localStorage.getItem('connectedUser');
};

// Set the connected username
export const setConnectedUsername = (username: string, blockchain: string = 'hive'): void => {
  localStorage.setItem('connectedUser', username);
  localStorage.setItem('connectedBlockchain', blockchain);
};

// Clear the connected username (logout)
export const clearConnectedUsername = (): void => {
  localStorage.removeItem('connectedUser');
  localStorage.removeItem('connectedBlockchain');
};

// Check if user owns a project (mock implementation)
export const userOwnsProject = (projectId: string, username: string | null): boolean => {
  // Mock implementation for testing
  if (!username) return false;
  
  // For mock user, allow them to own specific project IDs
  if (username === 'mockuser') {
    return ['1', '2', '3'].includes(projectId);
  }
  
  // Check localStorage for project ownership data
  const ownedProjects = JSON.parse(localStorage.getItem('userOwnedProjects') || '{}');
  return username in ownedProjects && ownedProjects[username].includes(projectId);
};

// Check if Hive Keychain is installed
export const isKeychainInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof window.hive_keychain !== 'undefined';
};

// Get DID (Decentralized Identity) verification status for a user
export const getDidVerification = async (username: string): Promise<import('./types').DidVerification> => {
  // This is a mock implementation for testing
  // In a real application, this would check against a DID provider or blockchain
  
  // For demo purposes, we'll return verified for certain users
  if (['demo', 'admin', 'verified'].includes(username)) {
    return {
      username,
      level: 'verified',
      lastVerified: new Date().toISOString(),
      provider: 'Mock DID Provider'
    };
  }
  
  // For mockuser, return basic verification
  if (username === 'mockuser') {
    return {
      username,
      level: 'basic' as 'pending', // Cast to a supported level for backward compatibility
      lastVerified: new Date().toISOString(),
      provider: 'Mock DID Provider'
    };
  }
  
  // For all others, return unverified
  return {
    username,
    level: 'unverified'
  };
};
