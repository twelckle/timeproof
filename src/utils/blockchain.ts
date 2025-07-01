
export const CONTRACT_ADDRESS = '0x94eFf10792A84B0422928576E3b18311AEB9d407';
export const ABI = [
    'function submitIdea(string memory ideaText) external',
    'function getIdea(string memory ideaText) external view returns (address, uint256)',
    'function getIdeaByHash(bytes32 ideaHash) external view returns (address, uint256)',
    'function submitIdeaHash(bytes32 ideaHash) external',
];

export const normalizeIdea = (text: string) =>
    text.trim().replace(/\s+/g, ' ');