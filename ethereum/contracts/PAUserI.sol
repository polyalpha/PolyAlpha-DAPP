pragma solidity ^0.4.24;

import "./Ownable.sol";

contract PAUserI is Ownable {
    event UserJoined(address indexed owner, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl);
    event UserProfileUpdated(address indexed owner, bytes32 name, bytes32 avatarUrl);

    struct User {
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
        bytes32 name;
        bytes32 avatarUrl;
        bool isRegistered;
    }

    function isRegistered(address sender) public view returns(bool);
    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl) public;
    function updateProfile(address sender, bytes32 name, bytes32 avatarUrl) public;
}