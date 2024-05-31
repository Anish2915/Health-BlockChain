import React , {Component} from 'react'
import './App.css'
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importing pages and components
import NavbarUser from './comp/NavbarUser';
import Home from './pages/Home';
import Trade from './pages/Trade';
import CrossChain from './pages/CrossChain';

class App extends Component{

    async UNSAFE_componentWillMount(){
        // await this.loadWeb3();
        // await this.loadBlockchainData();
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
        this.setState({account: account[1]});

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

        const rwdData = RWD.networks[networkId];
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi,rwdData.address);
            this.setState({rwd});
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({rwdBalance: rwdBalance.toString()});
            console.log({balance : rwdBalance});
        }
        else{
            window.alert('Error : RWD contract not deployed');
        }

    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            tether: {},
            tetherBalance: '0',
            rwd: {},
            rwdBalance: '0'
        }
    }

    render() {
        return (
            <div className='text-center'>
                <h>{this.state.account}</h>
                <h1>{window.web3.utils.fromWei(this.state.tetherBalance,'Ether')}</h1>
                <h2>{window.web3.utils.fromWei(this.state.rwdBalance,'Ether')}</h2>
                <BrowserRouter>
                    <NavbarUser />
                    <Routes>
                        <Route to='/' element={Home}/>
                        <Route to='/trade' element={Trade} />
                        <Route to='/cross-chain' element={CrossChain} />
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;