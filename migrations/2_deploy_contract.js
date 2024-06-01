const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');
const CompanyNFT = artifacts.require('CompanyNFT');
const Upload = artifacts.require('Upload');


module.exports = async function (deployer,network,accounts){

    //await deployer.deploy(OnDie, { value: web3.utils.toWei("5", "ether") });

    await deployer.deploy(RWD,1000);
    const rwd = await RWD.deployed();
    
    //await rwd.transfer(accounts[0], '100000000000000000000');
    await rwd.transfer(accounts[1] , '100000000000000000000');
    await rwd.transfer(accounts[2] , '100000000000000000000');
    await rwd.approve(rwd.address,'1000000000000000000000');

    console.log(accounts);

    let bal = await rwd.balanceOf(accounts[0]);
    console.log(`Balance of ${accounts[0]} = `,bal.toString());   
    bal = await rwd.balanceOf(accounts[1]);
    console.log(`Balance of ${accounts[1]} = `,bal.toString());   
    bal = await rwd.balanceOf(accounts[2]);
    console.log(`Balance of ${accounts[2]} = `,bal.toString());   
    // await rwd.transfer(accounts[2], '100000000000000000000', {from: accounts[1]});
    
    // bal = await rwd.balanceOf(accounts[0]);
    // console.log(`Balance of ${accounts[0]} = `,bal.toString());   
    // bal = await rwd.balanceOf(accounts[1]);
    // console.log(`Balance of ${accounts[1]} = `,bal.toString());   
    // bal = await rwd.balanceOf(accounts[2]);
    // console.log(`Balance of ${accounts[2]} = `,bal.toString());


    await deployer.deploy(CompanyNFT, rwd.address , accounts[0]);
    const companyNFT = await CompanyNFT.deployed();

    await deployer.deploy(Upload, rwd.address , accounts[0]);
    const upload = await Upload.deployed();

    // await companyNFT.registerCompany("Anish", { from: accounts[1] });

    // // // Verify if the company is registered
    // await companyNFT.registeredCompanies[accounts[1]];


    // await companyNFT.releaseNFT("NFT 1",  web3.utils.toWei('1', 'ether'), { from: accounts[1] });

    // const nftt = await companyNFT.getNFT(0);
    // console.log(nftt.owner.toString());
    
    // await companyNFT.buyNFT( 0 , {from: accounts[2] });



    // bal = await rwd.balanceOf(accounts[0]);
    // console.log(`Balance of ${accounts[0]} = `,bal.toString());   
    // bal = await rwd.balanceOf(accounts[1]);
    // console.log(`Balance of ${accounts[1]} = `,bal.toString());   
    // bal = await rwd.balanceOf(accounts[2]);
    // console.log(`Balance of ${accounts[2]} = `,bal.toString());

    // const nft = await companyNFT.getNFT(0);
    // console.log(nft.owner.toString());

    // const tokenId = 1; // Change to the tokenId of the NFT you want to buy
    // const ownerBefore = await companyNFT.nfts(tokenId).owner;

    // try {
    //     const bal = await rwd.balanceOf(accounts[0]);
    //     const bal1 = await rwd.balanceOf(accounts[1]);
    //     console.log(bal.toString());
    //     console.log(bal1.toString());
    // } catch (error) {
    //     console.error("Error fetching balance:", error);
    // }
    
    // try{
    //     await companyNFT.buyNFT(tokenId);
    // }
    // catch(error){
    //     console.error("Error:", error.message);
    // }
};