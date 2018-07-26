pragma solidity ^0.4.24;

interface PAMessagingI {
    event MessageSent(address sender, address receiver, bytes message);

    function sendMessage(address sender, address toUser, bytes message) external;
}