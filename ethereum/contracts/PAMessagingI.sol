pragma solidity ^0.4.24;

interface PAMessagingI {
    event MessageSent(address owner, address toUser, bytes message);

    function sendMessage(address sender, address toUser, bytes message) external;
}