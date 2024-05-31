const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');
const CompanyNFT = artifacts.require('CompanyNFT');


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
    
    await deployer.deploy(CompanyNFT, decentralbank.address);
    const companyNFT = await CompanyNFT.deployed();

    const tx = await companyNFT.registerCompany("Anish", { from: accounts[0] });
    console.log('Company registration transaction hash:', tx.tx);

    // Print event details
    const event = tx.logs.find(log => log.event === 'CompanyRegistered');
    if (event) {
        console.log(`CompanyRegistered event: companyAddress = ${event.args.companyAddress}, name = ${event.args.name}`);
    } else {
        console.log('CompanyRegistered event not found');
    }

    // Verify if the company is registered
    const company = await companyNFT.companies(accounts[0]);
    console.log('Registered company:', company);
    
};