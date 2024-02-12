import { useState } from "react";
import axios from 'axios';

function App() {
  const [data_name, set_data_name] = useState("");
  const [data_balanceof, set_data_balanceof] = useState("");
  const [mint_recipt, set_mint_recipt] = useState();
  
  
  const [address,set_address] = useState('');
  const [amount,set_amount] = useState('');
  
  
  const get_name = (e) => {
    e.preventDefault();
      const url = 'http://localhost:5000/getName';
      axios.post(url).then((response) => {  
      set_data_name(response.data.name);
      //console.log(response.data.name);
      }).catch((error) => {
      console.log(error);
    });
  }

  const get_balanceof = (e) => {
    e.preventDefault();
      const url = 'http://localhost:5000/getBalance';
      //console.log(address);
      axios.post(url,{address}).then((response) => {  
        set_data_balanceof(response.data.bal);
      //console.log(response.data.name);
      }).catch((error) => {
      console.log(error);
    });
  }

  const mint = (e) => {
    e.preventDefault();
      const url = 'http://localhost:5000/mint';
      console.log(amount)
      axios.post(url,{address,amount}).then((response) => {
        if(response.data.flag){
          const { message, flag, status, blocknumber } = response.data;
          set_mint_recipt([message, flag, status, blocknumber]);
        }
        else{
          const { message, flag } = response.data;
          set_mint_recipt([message, flag ]);
        }       
      //console.log(response.data.name);
      }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="App">

      <button onClick={get_name}>GET NAME</button>
      <p>{data_name}</p>
      
      
      <input
        type="text"
        id="User_address"
        value={address}
        onChange={(e)=>set_address(e.target.value)}
        placeholder="Enter address to check balance"
      />
      <button onClick={get_balanceof}>Check Balance</button>
      <p>{data_balanceof}</p>

      <input
        type="text"
        id="User_address"
        value={address}
        onChange={(e)=>set_address(e.target.value)}
        placeholder="Enter address to mint"
      />
      <input
        type="text"
        id="amount"
        value={amount}
        onChange={(f)=>set_amount(f.target.value)}
        placeholder="Enter amount to mint"
      />
      <button onClick={mint}>Mint</button>
      <p>{mint_recipt}</p>
    </div>
  );
}
export default App;