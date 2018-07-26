pragma solidity ^0.4.24;

interface PAUserI {
    event UserJoined(address indexed owner, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl);
    event UserProfileUpdated(address indexed owner, bytes32 name, bytes32 avatarUrl);
    event UserAvailabilityUpdated(address indexed owner, bool availability);

    function isRegistered(address addr) external view returns(bool);
    function isAvailable(address addr) external view returns(bool);
    function getUser(address addr) external view returns(bytes32, bytes32, bytes32, bytes32);
    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 username, bytes32 name, bytes32 avatarUrl) external;
    function updateProfile(address sender, bytes32 username, bytes32 name, bytes32 avatarUrl) external;
    function isUsernameAvailable(bytes32 username) external returns(bool);
    function updateAvailability(address sender, bool availability) external;
}