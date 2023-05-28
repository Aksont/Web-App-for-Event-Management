import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer, VictoryLabel } from 'victory';
import "bootstrap/dist/css/bootstrap.css";
// import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

export default function ReportCharts({data}){
    console.log(data)

    if (!!data){
        return <>
        <Row>
            <Col sm={6} align="center" className='mt-3'>
                <p style={{fontSize: "xx-large"}}>Income</p>
            </Col>
            <Col sm={6} align="center" className='mt-3'>
                <p style={{fontSize: "xx-large"}}>Number of tickets</p>
            </Col>
        </Row>
        <Row >
            <Col sm={6}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={20}
                    containerComponent={
                        <VictoryZoomContainer
                        allowZoom={false}
                        zoomDomain={{x:[0,4]}}/>
                    }
                    animate={{
                        duration: 1000,
                    }}
                    
                >
                    <VictoryAxis />
                    <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`${x}`)}
                    />
                    <VictoryBar
                        data={data}
                        x="period"
                        y="income"
                        barWidth={30}
                        labels={({ datum }) => datum.income}
                        style={
                            { 
                                labels: { fill: "white" },
                                data: { fill: "#5da4b4" } 
                            }
                        }
                        labelComponent={<VictoryLabel dy={30}/>}
                        
                    />
                </VictoryChart>
            </Col>
            <Col sm={6}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={20}
                    containerComponent={
                        <VictoryZoomContainer
                        allowZoom={false}
                        zoomDomain={{x:[0,4]}}/>
                    }
                    animate={{
                        duration: 1000,
                    }}
                >
                    <VictoryAxis />
                    <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`${x}`)}
                    />
                    <VictoryBar
                        data={data}
                        x="period"
                        y="numOfTickets"
                        barWidth={30}
                        labels={({ datum }) => datum.numOfTickets}
                        style={
                            { 
                                labels: { fill: "white" },
                                data: { fill: "#5da4b4" } 
                            }
                        }
                        labelComponent={<VictoryLabel dy={30}/>}
                    />
                </VictoryChart>
            </Col>
        </Row>
    </>
    }
    
}