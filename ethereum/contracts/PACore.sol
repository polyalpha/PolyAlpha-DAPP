pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./OwnableI.sol";
import "./PAUserI.sol";
import "./PAAttentionBiddingI.sol";
import "./PAMessagingI.sol";

contract PACore is Ownable {
    PAUserI public userContract;
    PAAttentionBiddingI public bidContract;
    PAMessagingI public messagingContract;

    constructor(address userContractAddress, address bidContractAddress,
        address messagingContractAddress) public {
        
        userContract = PAUserI(userContractAddress);
        bidContract = PAAttentionBiddingI(bidContractAddress);
        messagingContract = PAMessagingI(messagingContractAddress);
    }

    /// Check if an address is registered on PolyAlpha
    function isRegistered(address addr) public view returns (bool) {
        return userContract.isRegistered(addr);
    }

    function isUserAvailable(address addr) public view returns (bool) {
        return userContract.isUserAvailable(addr);
    }

    function isUsernameAvailable(bytes32 username) public view returns(bool) {
        return userContract.isUsernameAvailable(username);
    }

    function getUser(address addr) public view returns(bytes32, bytes32, bytes32, bytes32, bytes32, bytes, bool) {
        return userContract.getUser(addr);
    }

    function register(bytes32 publicKeyLeft, bytes32 publicKeyRight, bytes32 username, bytes32 name, bytes32 avatarUrl, bytes extra) public {
        userContract.register(msg.sender, publicKeyLeft, publicKeyRight, username, name, avatarUrl, extra);
    }

    function updateProfile(bytes32 username, bytes32 name, bytes32 avatarUrl, bytes extra) public {
        userContract.updateProfile(msg.sender, username, name, avatarUrl, extra);
    }

    function updateAvailability(bool availability) public {
        userContract.updateAvailability(msg.sender, availability);
    }

    function getBid(address fromUser, address toUser) public view returns(uint256, Static.BidStatus){
        return bidContract.getBid(fromUser, toUser);
    }

    function createBid(address toUser, uint256 tokenAmount, bytes message) public {
        bidContract.createBid(msg.sender, toUser, tokenAmount, message);
    }

    function cancelBid(address toUser) public {
        bidContract.cancelBid(msg.sender, toUser);
    }

    function acceptBid(address fromUser, bytes message) public {
        bidContract.acceptBid(msg.sender, fromUser, message);
    }

    function blockBid(address fromUser) public {
        bidContract.blockBid(msg.sender, fromUser);
    }

    function sendMessage(address toUser, bytes message) public {
        messagingContract.sendMessage(msg.sender, toUser, message);
    }


    /**
    * ------------ ONLY OWNER ------------
    * Allows owner to update sub contracts if needed
    */

    function setUserContract(address addr) public onlyOwner {
        userContract = PAUserI(addr);
    }

    function setBidContract(address addr) public onlyOwner {
        bidContract = PAAttentionBiddingI(addr);
    }

    function setMessagingContract(address addr) public onlyOwner {
        messagingContract = PAMessagingI(addr);
    }

    /**
    * ------------ ONLY OWNER ------------
    * Allows owner to transfer sub contracts if needed
    */

    function transferUserContract(address addr) public onlyOwner {
        OwnableI(userContract).transferOwnership(addr);
    }

    function transferBidContract(address addr) public onlyOwner {
        OwnableI(bidContract).transferOwnership(addr);
    }

    function transferMessagingContract(address addr) public onlyOwner {
        OwnableI(messagingContract).transferOwnership(addr);
    }
}