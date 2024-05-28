pragma solidity ^0.5.0;

import "@chainlink/contracts/src/v0.5/ChainlinkClient.sol";

contract ProofOfReserve is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public reserveAmount;
    bytes32 private jobId;
    uint256 private fee;
    string private apiUrl;
    string private apiPath;
    address public owner;

    event ReserveVerified(uint256 reserveAmount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(
        address _link,
        address _oracle,
        string memory _jobId,
        uint256 _fee,
        string memory _apiUrl,
        string memory _apiPath
    ) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = stringToBytes32(_jobId);
        fee = _fee;
        apiUrl = _apiUrl;
        apiPath = _apiPath;
        owner = msg.sender;
    }

    function requestReserveData() public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        request.add("get", apiUrl);

        // Define the path to find the data we want
        request.add("path", apiPath);

        // Sends the request
        return sendChainlinkRequestTo(chainlinkOracleAddress(), request, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _reserveAmount)
        public
        recordChainlinkFulfillment(_requestId)
    {
        reserveAmount = _reserveAmount;
        emit ReserveVerified(reserveAmount);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}
