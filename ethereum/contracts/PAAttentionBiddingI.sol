pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./PAUserI.sol";
import "./PATokenI.sol";

contract PAAttentionBiddingI is Ownable {
    event BidCreated(address indexed owner, address indexed toUser, uint256 tokenAmount);
    event BidAccepted(address indexed owner, address indexed fromUser);
    event BidBlocked(address indexed owner, address indexed fromUser);

    enum BidStatus {NOBID, CREATED, ACCEPTED, BLOCKED}

    PAUserI userContract;
    PATokenI tokenContract;

    struct Bid {
        uint256 value;
        BidStatus status;
    }

    function getBid(address fromUser, address toUser) public view returns(uint256, BidStatus);
    function createBid(address sender, address toUser, uint256 tokenAmount) public;
    function accepteBid(address sender, address fromUser) public;
    function blockBid(address sender, address fromUser) public;
}
