const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');
const OnDie = artifacts.require("OnDie");
const ProofOfReserve = artifacts.require('ProofOfReserve');


module.exports = async function (deployer,network,accounts){
    await deployer.deploy(Tether);
    const tether  = await Tether.deployed();

    //await deployer.deploy(OnDie, { value: web3.utils.toWei("5", "ether") });

    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();
    
    await deployer.deploy(DecentralBank,rwd.address , tether.address);
    const decentralbank = await DecentralBank.deployed();
    
    await rwd.transfer(decentralbank.address , '10000000000000000000000');
    await tether.transfer(accounts[1],'2000000000000000000');
    
    
    
};