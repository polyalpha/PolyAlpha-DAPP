pragma solidity ^0.4.24;

interface PAUserI {
    event UserJoined(address indexed sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 username, bytes32 name, bytes32 avatarUrl, bytes extra);
    event UserProfileUpdated(address indexed sender, bytes32 username, bytes32 name, bytes32 avatarUrl, bytes extra);
    event UserAvailabilityUpdated(address indexed sender, bool availability);

    function isRegistered(address addr) external view returns(bool);
    function isUserAvailable(address addr) external view returns(bool);
    function isUsernameAvailable(bytes32 username) external view returns(bool);
    function getUser(address addr) external view returns(bytes32, bytes32, bytes32, bytes32, bytes32, bytes, bool);

    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 username, bytes32 name, bytes32 avatarUrl, bytes exra) external;
    function updateProfile(address sender, bytes32 username, bytes32 name, bytes32 avatarUrl, bytes extra) external;
    function updateAvailability(address sender, bool availability) external;
}