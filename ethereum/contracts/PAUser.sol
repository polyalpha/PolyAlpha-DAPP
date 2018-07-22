pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./PAUserI.sol";

contract PAUser is PAUserI, Ownable {
    struct User {
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
        bytes32 name;
        bytes32 avatarUrl;
        bool isRegistered;
    }

    mapping(address => User) users;

    function isRegistered(address addr) public view returns(bool) {
        return users[addr].isRegistered;
    }

    function getUser(address addr) public view returns(bytes32, bytes32, bytes32, bytes32) {
        User storage u = users[addr];
        return (u.publicKeyLeft, u.publicKeyRight, u.name, u.avatarUrl);
    }

    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 name, bytes32 avatarUrl) public onlyOwner {
        require(users[sender].isRegistered == false);

        User memory u = User(publicKeyLeft, publicKeyRight, name, avatarUrl, true);
        users[sender] = u;

        emit UserJoined(sender, publicKeyLeft, publicKeyRight, name, avatarUrl);
    }

    function updateProfile(address sender, bytes32 name, bytes32 avatarUrl) public onlyOwner {
        require(users[sender].isRegistered == true);
        
        User storage u = users[sender];
        u.name = name;
        u.avatarUrl = avatarUrl;

        emit UserProfileUpdated(sender, name, avatarUrl);
    }
}