pragma solidity ^0.4.24;

import "./PAMessagingI.sol";
import "./Ownable.sol";
import "./PAAttentionBiddingI.sol";
import "./Static.sol";

contract PAMessaging is PAMessagingI, Ownable {

    PAAttentionBiddingI bidContract;

    constructor(address bidContractAddress) public {
        bidContract = PAAttentionBiddingI(bidContractAddress);
    }

    function sendMessage(address sender, address toUser, bytes message) public onlyOwner {
        (, Static.BidStatus status) = bidContract.getBid(sender, toUser);
        require(status == Static.BidStatus.ACCEPTED);
        emit MessageSent(sender, toUser, message);
    }
}