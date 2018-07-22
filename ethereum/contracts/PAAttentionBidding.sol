pragma solidity ^0.4.24;

import "./PAAttentionBiddingI.sol";
import "./Ownable.sol";
import "./Static.sol";

contract PAAttentionBidding is PAAttentionBiddingI, Ownable {

    PAUserI userContract;
    PATokenI tokenContract;

    struct Bid {
        uint256 value;
        Static.BidStatus status;
    }

    mapping (address => mapping(address => Bid)) bids;

    constructor(address userContractAddress, address tokenContractAddress) public {
        userContract = PAUserI(userContractAddress);
        tokenContract = PATokenI(tokenContractAddress);
    }

    function getBid(address fromUser, address toUser) public view returns(uint256, Static.BidStatus) {
        require(userContract.isRegistered(fromUser) == true);
        require(userContract.isRegistered(toUser) == true);

        Bid storage b = bids[fromUser][toUser];
        return (b.value, b.status);
    }

    function createBid(address sender, address toUser, uint256 tokenAmount) public onlyOwner {
        require(userContract.isRegistered(sender) == true);
        require(userContract.isRegistered(toUser) == true);
        require(tokenContract.balanceOf(sender) >= tokenAmount);

        bids[sender][toUser] = Bid(tokenAmount, Static.BidStatus.CREATED);
        tokenContract.ownerApprove(sender, tokenAmount);

        emit BidCreated(sender, toUser, tokenAmount);
    }

    function accepteBid(address sender, address fromUser) public onlyOwner {
        require(userContract.isRegistered(sender) == true);
        require(userContract.isRegistered(fromUser) == true);

        Bid storage b = bids[fromUser][sender];
        require(b.status == Static.BidStatus.CREATED);

        b.status = Static.BidStatus.ACCEPTED;
        tokenContract.transferFrom(fromUser, sender, b.value);
        
        bids[fromUser][sender] = b;
        bids[sender][fromUser] = b;

        emit BidAccepted(sender, fromUser);
    }

    function blockBid(address sender, address fromUser) public onlyOwner {
        require(userContract.isRegistered(sender) == true);
        require(userContract.isRegistered(fromUser) == true);

        Bid storage b = bids[fromUser][sender];
        require(b.status == Static.BidStatus.CREATED || b.status == Static.BidStatus.ACCEPTED);

        b.status = Static.BidStatus.BLOCKED;
        bids[fromUser][sender] = b;
        bids[sender][fromUser] = b;

        emit BidBlocked(sender, fromUser);
    }
}