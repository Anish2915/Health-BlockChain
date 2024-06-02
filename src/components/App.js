import React , {Component} from 'react';
import './App.css';
// import Web3 from 'web3';
// import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importing pages and components
import NavbarUser from './comp/NavbarUser';
import Home from './pages/Home';
import Trade from './pages/Trade';
import CrossChain from './pages/CrossChain';
import Company from './pages/Company';
import NftPage from './pages/NftPage';
import Footer from './comp/Footer';

class App extends Component{

    // async UNSAFE_componentWillMount(){
    //     // await this.loadWeb3();
    //     // await this.loadBlockchainData();
    //     this.subscribeToAccountChanges();
    // }

    // async loadWeb3() {
    //     if(window.ethereum){
    //         window.web3 = new Web3(window.ethereum);
    //         await window.ethereum.enable();
    //     }
    //     else if (window.web3) {
    //         window.web3 = new Web3(window.web3.currentProvider)
    //     }
    //     else{
    //         window.alert('No ethereumm browser detected');
    //     }
    // }
  
//     async loadBlockchainData(){
//         const web3 = window.web3;
//         const account = await web3.eth.getAccounts();
//         console.log(account);
//         this.setState({account: account[1]});

//         const networkId = await web3.eth.net.getId();
//         const tetherData = Tether.networks[networkId];
//         if(tetherData){
//             const tether = new web3.eth.Contract(Tether.abi,tetherData.address);
//             this.setState({tether});
//             let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
//             this.setState({tetherBalance: tetherBalance.toString()});  
//             console.log({balance : tetherBalance});
//         }
//         else{
//             window.alert('Error : Tether contract not deployed');
//         }

//         const rwdData = RWD.networks[networkId];
//         if(rwdData){
//             const rwd = new web3.eth.Contract(RWD.abi,rwdData.address);
//             this.setState({rwd});
//             let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
//             this.setState({rwdBalance: rwdBalance.toString()});
//             console.log({balance : rwdBalance});
//         }
//         else{
//             window.alert('Error : RWD contract not deployed');
//         }

//     }

    // subscribeToAccountChanges() {
    //     window.ethereum.on('accountsChanged', (accounts) => {
    //         this.setState({ account: accounts[0] });
    //         this.loadBlockchainData();
    //     })
    // }

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

    setAccount = (account) => {
        this.setState({ account });
    }

    render() {
        return (
            <div className='text-center'>
                <h>{this.state.account}</h>
                {/* <h1>{window.web3.utils.fromWei(this.state.tetherBalance,'Ether')}</h1>
                <h2>{window.web3.utils.fromWei(this.state.rwdBalance,'Ether')}</h2> */}
                <BrowserRouter>
                    <NavbarUser account={this.state.account} setAccount={this.setAccount} />
                    <Routes>
                        <Route path='/' element={<Home account={this.state.account} setAccount={this.setAccount} />}/>
                        <Route path='/trade' element={<Trade account={this.state.account} />} />
                        <Route path='/cross-chain' element={<CrossChain account={this.state.account} />} />
                        <Route path='/company' element={<Company account={this.state.account} />} />
                        <Route path='nft/:nftid' element={<NftPage />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        )
    }
}

export default App;