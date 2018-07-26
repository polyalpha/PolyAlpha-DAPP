pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./PAUserI.sol";

contract PAUser is PAUserI, Ownable {
    struct User {
        bytes32 publicKeyLeft;
        bytes32 publicKeyRight;
        bytes32 username; // Username is unique
        bytes32 name;
        bytes32 avatarUrl;
        bool available;
        bool isRegistered;
    }

    mapping(address => User) users;
    mapping(bytes32 => bool) usernameUseds;

    function isRegistered(address addr) public view returns(bool) {
        return users[addr].isRegistered;
    }

    function isUserAvailable(address addr) public view returns(bool) {
        return users[addr].available;
    }

    function isUsernameAvailable(bytes32 username) public view returns(bool) {
        return !usernameUseds[lowerCase(username)];
    }

    function getUser(address addr) public view returns(bytes32, bytes32, bytes32, bytes32, bytes32, bool) {
        User storage u = users[addr];
        return (u.publicKeyLeft, u.publicKeyRight, u.username, u.name, u.avatarUrl, u.available);
    }

    function register(address sender, bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 username, bytes32 name, bytes32 avatarUrl) public onlyOwner {
        require(users[sender].isRegistered == false);
        require(usernameUseds[username] == false);

        User memory u = User(publicKeyLeft, publicKeyRight, username, name, avatarUrl, true, true);
        users[sender] = u;
        usernameUseds[lowerCase(username)] = true;

        emit UserJoined(sender, publicKeyLeft, publicKeyRight, username, name, avatarUrl);
    }

    function updateProfile(address sender, bytes32 username, bytes32 name, bytes32 avatarUrl) public onlyOwner {
        require(users[sender].isRegistered == true);
        
        User storage u = users[sender];
        if (lowerCase(u.username) != lowerCase(username)) {
            usernameUseds[u.username] = false;
            u.username = username;
            usernameUseds[lowerCase(u.username)] = true;
        }
        u.name = name;
        u.avatarUrl = avatarUrl;

        emit UserProfileUpdated(sender, username, name, avatarUrl);
    }

    function updateAvailability(address sender, bool availability) external onlyOwner{
        require(users[sender].isRegistered == true);
        require(users[sender].available != availability);

        users[sender].available = availability;

        emit UserAvailabilityUpdated(sender, availability);
    }

    function lowerCase(bytes32 value) private pure returns (bytes32) {
        bytes32 result = value;
        for (uint i = 0; i < 32; i++) {
            if (uint(value[i]) >= 65 && uint(value[i]) <= 90) {
                result |= bytes32(0x20) << (31-i)*8;
            }
        }
        return result;
    }
}