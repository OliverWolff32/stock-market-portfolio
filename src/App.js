import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button } from 'reactstrap';
import StockList from './StockList';
import './App.css';


function App() {
  
  // Uncomment setMyName if required, for example, if the name
  // is stored in the DynamoDB
  const [myName/*, setMyName*/] = useState('Roger');
  
  const [stocks, setStocks] = useState([]);
  const [stockList, setStockList] = useState([]);
  
  const fetch = require('node-fetch');

  const AWS_API_GATEWAY = 'https://udo3rnl46k.execute-api.us-east-1.amazonaws.com/prod';
  const AWS_API_GATEWAY_GET_PORTFOLIO = AWS_API_GATEWAY + '/get-portfolio';



  // Retrieve the current stock information when the page first loads
  useEffect(() => {
    //setStocks(sampleData);
    const options = {
      method: 'POST',
      cache: 'default'
    };
    
    fetch(AWS_API_GATEWAY_GET_PORTFOLIO, options)
      .then(function(response) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(function(response) {
        console.log(response);
        
        let stockList = response.Items.map(item => {
          item.ticker = item.ticker.S;
          item.shares = item.shares.N;
          item.purchasePrice = item.purchasePrice.N;
          item.name = item.name.S;
          console.log(item);
          return item;
          
        });

        // When the above code finishes, stockList should be an array of objects that
        // the StockListItem component will be able to render on the web page!
        // We still need to retrieve the real-time stock price, but we'll do that in a 
        // later step and we'll do it in the AWS Lambda function

        // After we've generated the stockList items we need to set the stockList state
        // variable so the StockListItem component can render the data
        setStocks(stockList);
      })
      .catch(function(error) {
        console.log(error);
      })

  }, []);
  
  // With the stock data add purchase value, current price
  // and current value to the stock record
  useEffect(() => {
    const enhancedStocks = stocks.map(stock => {
      stock.purchaseValue = stock.shares * stock.purchasePrice;
      stock.currentPrice = Math.random()*200 + 50;
      stock.currentValue = stock.shares * stock.currentPrice;
      stock.profit = stock.currentValue - stock.purchaseValue;
      return stock;
    })
    setStockList(enhancedStocks);
  }, [stocks])
  
  const addStock = evt => {
    console.log('add stock clicked');
  }

  return (
    <div className="App">
      <Card>
        <CardHeader className="card-header-color">
          <h4>{myName}'s Stock Portfolio</h4>
        </CardHeader>
        <CardBody>
          <StockList data={stockList} />
        </CardBody>
        <CardFooter>
          <Button size="sm" onClick={addStock}>Add stock</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
