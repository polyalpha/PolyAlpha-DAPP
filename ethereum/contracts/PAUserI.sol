pragma solidity ^0.4.24;

interface PAUserI {
    event UserJoined(address indexed owner, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl);
    event UserProfileUpdated(address indexed owner, bytes32 name, bytes32 avatarUrl);

    function isRegistered(address addr) external view returns(bool);
    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl) external;
    function updateProfile(address sender, bytes32 name, bytes32 avatarUrl) external;
}