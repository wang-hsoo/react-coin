import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

interface PiceProps{
    coinId: string;
}

interface PiceInfo{
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

const PriceUl = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PriceLi = styled.li`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 9px 0px;
    border-radius: 10px;
    div{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        span:first-child {
            font-size: 12px;
            font-weight: 400;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
    }
`;

function Price({coinId}: PiceProps){
    //코인 가격 기록
    const {isLoading, data} = useQuery<PiceInfo[]>(["price", coinId],
    () => fetchCoinHistory(coinId));

    console.log(data?.reverse());
    return(
        <PriceUl>
            {isLoading ? "Loading chart ..." : 
            <>
               {data?.map((data) => (
                <PriceLi key={data.time_open}>
                    <div>
                        <span>open: </span>
                        <span>{data.open}</span>
                    </div>
                    <div>
                        <span>close: </span>
                        <span>{data.close}</span>
                    </div>
                    <div>
                        <span>high: </span>
                        <span>{data.high}</span>
                    </div>
                    <div>
                        <span>low:  </span>
                        <span>{data.low}</span>
                    </div>
                </PriceLi>
               ))}
            </>
            }
        </PriceUl>
    )
}

export default Price;