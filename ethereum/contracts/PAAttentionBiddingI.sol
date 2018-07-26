pragma solidity ^0.4.24;

import "./PAUserI.sol";
import "./PATokenI.sol";
import "./Static.sol";

interface PAAttentionBiddingI {
    event BidCreated(address indexed sender, address indexed receiver, uint256 tokenAmount);
    event BidCancelled(address indexed sender, address indexed receiver);
    event BidAccepted(address indexed sender, address indexed receiver);
    event BidBlocked(address indexed sender, address indexed receiver);

    function getBid(address fromUser, address toUser) external view returns(uint256, Static.BidStatus);
    function createBid(address sender, address toUser, uint256 tokenAmount) external;
    function cancelBid(address sender, address toUser) external;
    function acceptBid(address sender, address fromUser) external;
    function blockBid(address sender, address fromUser) external;
}
