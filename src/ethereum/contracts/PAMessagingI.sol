pragma solidity ^0.4.24;

interface PAMessagingI {
    event MessageSent(address indexed sender, address indexed receiver, bytes message);

    function sendMessage(address sender, address toUser, bytes message) external;
}