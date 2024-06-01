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
    
    await rwd.transfer(accounts[0], '100000000000000000000');
    await rwd.transfer(accounts[1] , '100000000000000000000');
    await tether.transfer(accounts[1],'2000000000000000000');
    
    await deployer.deploy(CompanyNFT, rwd.address);
    const companyNFT = await CompanyNFT.deployed();

    const tx = await companyNFT.registerCompany("Anish", { from: accounts[0] });
    console.log('Company registration transaction hash:', tx.tx);

    const event = tx.logs.find(log => log.event === 'CompanyRegistered');
    if (event) {
        console.log(`CompanyRegistered event: companyAddress = ${event.args.companyAddress}, name = ${event.args.name}`);
    } else {
        console.log('CompanyRegistered event not found');
    }

    // Verify if the company is registered
    const company = await companyNFT.companies(accounts[0]);
    console.log('Registered company:', company);


    await companyNFT.releaseNFT("NFT 1", 365, web3.utils.toWei('1', 'ether'), { from: accounts[0] });
    await companyNFT.releaseNFT("NFT 2", 365, web3.utils.toWei('1', 'ether'), { from: accounts[0] });
    await companyNFT.releaseNFT("NFT 3", 365, web3.utils.toWei('1', 'ether'), { from: accounts[0] });

    const nextTokenId = await companyNFT.nextTokenId();
    console.log(`Total NFTs released: ${nextTokenId.toString()}`);
    for (let tokenId = 0; tokenId < nextTokenId; tokenId++) {
        const nftInfo = await companyNFT.nfts(tokenId);
        console.log(`NFT ${tokenId}: ${nftInfo.name}`);
    }

    


    const tokenId = 1; // Change to the tokenId of the NFT you want to buy
    const ownerBefore = await companyNFT.nfts(tokenId).owner;

    try {
        const bal = await rwd.balanceOf(accounts[0]);
        const bal1 = await rwd.balanceOf(accounts[1]);
        console.log(bal.toString());
        console.log(bal1.toString());
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
    
    try{
        await companyNFT.buyNFT(tokenId, { from: accounts[0] });
    }
    catch(error){
        console.error("Error:", error.message);
    }
};