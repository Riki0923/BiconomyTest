import './App.css';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ChainId } from "@biconomy/core-types"
import { Wallet, providers, ethers } from 'ethers';
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css"
import { create } from 'domain';

const App:any =  () => {

  // configuration of the dotenv file, basically just the private key
  console.log(process.env)


  // This is the social login part of Biconomy  
  const socialLogin = async () => { 
    const socialLogin = new SocialLogin()
    await socialLogin.init(); 
  
    socialLogin.showWallet();
  }

  // This is the quickstart guide of Biconomy

const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
const wallet = new Wallet(process.env.REACT_APP_PRIVATE_KEY || "", provider);


const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/abc',     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
  signer: wallet,
  chainId: ChainId.POLYGON_MUMBAI,
  bundler: bundler
}

  const createAccount = async () => {
    let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
    biconomySmartAccount =  await biconomySmartAccount.init()
    console.log("owner: ", biconomySmartAccount.owner)
    console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
    return biconomySmartAccount;
  }

  const createTransaction = async () => {
    console.log("creating account")

  const smartAccount = await createAccount();

  const transaction = {
    to: '0x322Af0da66D00be980C7aa006377FCaaEee3BDFD',
    data: '0x',
    value: ethers.utils.parseEther('0.1'),
  }

  const userOp = await smartAccount.buildUserOp([transaction])
  userOp.paymasterAndData = "0x"

  const userOpResponse = await smartAccount.sendUserOp(userOp)

  const transactionDetail = await userOpResponse.wait()

  console.log("transaction detail below")
  console.log(transactionDetail)
  }

  return (
    <div className="App">
      <button onClick={() =>socialLogin()}>Create Web3 account</button>
      <button onClick={() => createAccount()}>Create Smart Account</button>

    </div>
  );
}

export default App;
