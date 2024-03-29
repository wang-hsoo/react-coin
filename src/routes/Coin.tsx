import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Switch, Route, useLocation, useParams } from "react-router";
import { useRouteMatch, Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";
import {Helmet} from "react-helmet";

const Container = styled.div`
    padding : 0 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;

    a{
      position: absolute;
      top: 20px;
      right: 40px;
    }

`

const Title = styled.h1`
    color: ${props => props.theme.accentColor};
    font-size: 48px;
`;

const Loader = styled.div`
    text-align: center;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 10px;
`

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteParams{
    coinId:string;
}

interface RouteState{
    name: string;
}

interface InfoData{
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData{
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}





function Coin(){ 
  const {state} = useLocation<RouteState>();
  const {coinId} = useParams<RouteParams>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  //해당 코인에 대한 기본 정보
  const {isLoading: infoLoading, data: infoData} = useQuery<InfoData>(["info", coinId], () => fetchCoinInfo(coinId));
  //해당 코인에 대한 가격 정보 ( 고점 저점 . . .)
  const {isLoading: tickersLoading, data: tickerData} = useQuery<PriceData>(
    ["tickers",coinId], 
    () => fetchCoinTickers(coinId),
    
    );


  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  // const [info, setInfo] = useState<InfoData>();
  // const [loading, setLoading] = useState(true);

  //  useEffect(() => {
  //   (async () => {
  //       const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
       
  //       const priceData = await(
  //           await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //       ).json();

  //       setInfo(infoData);
  //       setPriceInfo(priceData);
  //       setLoading(false);
  //   })();
  //  }, [coinId]);

  const loading = infoLoading || tickersLoading;

    return(
        <Container>
          <Helmet>
            <title>
              {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
            </title>
            </Helmet>
            <Header>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
                <Link to ={"/"}>&larr;</Link>
            </Header>
            {loading ? <Loader>Loading...</Loader>: (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>price:</span>
              <span>{tickerData?.quotes.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickerData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickerData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/${coinId}/price`}>
                <Price coinId ={coinId} />
            </Route>
            <Route path={`/${coinId}/chart`}>
                <Chart coinId ={coinId} />
            </Route>
          </Switch>
         
        </>
      )}
        </Container>
    )
}
export default Coin;