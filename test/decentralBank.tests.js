const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');
const Web3 = require('web3');

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner,customer]) => {

    let tether ,rwd, decentralbank;

    function tokens(number){
        return Web3.utils.toWei(number , 'ether');
    }

    before(async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralbank = await DecentralBank.new(rwd.address , tether.address);

        await rwd.transfer(decentralbank.address, tokens('1000000'));
        await tether.transfer(customer, tokens('100') , {from : owner});
    })

    describe('Mock Tether deployment' , async () => {
        it('matches name successfully' , async () =>{
            const name = await tether.name();
            assert.equal(name,'Tether token');
        })
    })

    describe('Decentral Bank deployment' , async () => {
        it('matches name successfully' , async () =>{
            const name = await decentralbank.name();
            assert.equal(name,'Decentral Bank');
        })

        it('contract has tokens',async () => {
            let balance = await rwd.balanceOf(decentralbank.address)
            assert.equal(balance,tokens('1000000'));
        })
    })
})