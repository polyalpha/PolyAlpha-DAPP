pragma solidity ^0.4.24;

import "./PAUserI.sol";
import "./PATokenI.sol";
import "./Static.sol";

interface PAAttentionBiddingI {
    event BidCreated(address indexed owner, address indexed toUser, uint256 tokenAmount);
    event BidAccepted(address indexed owner, address indexed fromUser);
    event BidBlocked(address indexed owner, address indexed fromUser);

    function getBid(address fromUser, address toUser) external view returns(uint256, Static.BidStatus);
    function createBid(address sender, address toUser, uint256 tokenAmount) external;
    function accepteBid(address sender, address fromUser) external;
    function blockBid(address sender, address fromUser) external;
}
