import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";


interface ChartProps{
    coinId: string;
}

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
  }

function Chart({coinId}: ChartProps){
    const {isLoading, data} = useQuery<IHistorical[]>(
        ["ohlcv", coinId], 
        () => fetchCoinHistory(coinId),
        {   
            //5초마다 데이터를 다시 불러온다
            refetchInterval: 5000,
        }
        );

    const isDark = useRecoilValue(isDarkAtom);

    return(
        <div>
            {isLoading ? "Loading chart ..." :
                <ApexChart 
                    type="line" 
                    series={[
                        {
                            name: "price",
                            data: data?.map(price => price.close)??[],
                        }
                    ]}
                    options={{
                        theme:{
                            mode:isDark ?  "dark" : "light"
                        },
                        chart : {
                            height: 300,
                            width: 500,
                            toolbar: {
                                show: false
                            },
                            background: "transparent",
                        },
                        grid: {
                            show: false
                        },
                        stroke: {
                            curve: "smooth",
                            width: 4,
                        },
                        yaxis: {
                            show: false
                        },
                        xaxis:{
                            axisBorder:{show:false},
                            labels: {show: false},
                            type: "datetime",
                            axisTicks:{show: false},
                            categories: data?.map(price => price.time_close)??[],
                        },
                        fill: {
                            type: "gradient",
                            gradient: {
                                gradientToColors: ["#0be881"],
                                stops: [0,100],
                            },
                        },
                        colors: ["#0fbcf9"],
                        tooltip: {
                            y:{
                                formatter: (value) => `$ ${value.toFixed(3)}`
                            }
                        }
                    }} 
                />
            }
        </div>
    )
}

export default Chart;