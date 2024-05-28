import React , {Component} from 'react'
import './App.css'
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json'

class App extends Component{

    async UNSAFE_componentWillMount(){
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else{
            window.alert('No ethereumm browser detected');
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        console.log(account);
        this.setState({account: account[0]});

        const networkId = await web3.eth.net.getId();
        const tetherData = Tether.networks[networkId];
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi,tetherData.address);
            this.setState({tether});
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({tetherBalance: tetherBalance.toString()});  
            console.log({balance : tetherBalance});
        }
        else{
            window.alert('Error : Tether contract not deployed');
        }
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            tetherBalance: '0'
        }
    }

    render() {
        return (
            <div className='text-center'>
                <h>{this.state.account}</h>
                <h1>{window.web3.utils.fromWei(this.state.tetherBalance,'Ether')}</h1>
            </div>
        )
    }
}

export default App;