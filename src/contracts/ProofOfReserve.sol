// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/dev/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/dev/ConfirmedOwner.sol";

contract ProofOfReserveConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public proofOfReserve;
    bytes32 private jobId;
    uint256 private fee;

    event RequestProofOfReserve(bytes32 indexed requestId, uint256 proofOfReserve);

    /**
     * Network: Kovan
     * Oracle: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e (Example Oracle)
     * Job ID: b6602d14e4734c49a5e1ce19d45a4632 (Example Job ID)
     * Fee: 0.1 LINK
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        setChainlinkOracle(0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e);
        jobId = "b6602d14e4734c49a5e1ce19d45a4632";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    function requestProofOfReserveData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillProofOfReserve.selector);
        // Send the request
        return sendChainlinkRequest(request, fee);
    }

    function fulfillProofOfReserve(bytes32 _requestId, uint256 _proofOfReserve) public recordChainlinkFulfillment(_requestId) {
        proofOfReserve = _proofOfReserve;
        emit RequestProofOfReserve(_requestId, _proofOfReserve);
    }

    function getLatestProofOfReserve() public view returns (uint256) {
        return proofOfReserve;
    }

    // Function to withdraw LINK from the contract
    function withdrawLink() external onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
}
