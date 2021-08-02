import React, {useEffect, useState} from "react";
import {months} from "../constants" ;

export const CustomerRewards = () => {
    const [transactionsData, setTransactionsData] = useState({
        transactions: [],
    });

    const [monthlyCustomerPointTrans, setMonthlyCustomerPointTrans] = useState(
        {}
    );
    const [totalCustomerPointTrans, setTotalCustomerPointTrans] = useState({});
     
    useEffect( () => {
        try {
          const fetchData =  async ()=>{

            const res = await fetch("http://localhost:8080/customertransactions", {
              headers: {
                "Content-Type": "application/json",
              },
            });
            const resJson = await res.json();
            setTransactionsData(resJson);
          }
          fetchData();
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        getRewardsPointPerMonth(transactionsData);
    }, [transactionsData]);

    

    const getRewardPointsFromAmount = (amount) => {
        let point = 0;
        if (amount > 50) {
            point = amount - 50;
        }
        if (amount > 100) {
            point = point + amount - 100;
        }
        return point;
    };

    const getRewardsPointPerMonth = (transactionsData) => {
        let monthlyCustomerPointTrans = {};
        let totalCustomerPointTrans = {};

        console.log(transactionsData);
        transactionsData &&
        transactionsData.transactions &&
        transactionsData.transactions.forEach((el) => {
            let d = new Date(el.datetime);
            let month = months[d.getMonth()];
            if (!monthlyCustomerPointTrans[month]) {
                monthlyCustomerPointTrans[month] = {};
            }
            if (!monthlyCustomerPointTrans[month][el.customerName]) {
                monthlyCustomerPointTrans[month][el.customerName] = 0;
            }

            if (!totalCustomerPointTrans[el.customerName]) {
                totalCustomerPointTrans[el.customerName] = 0;
            }

            monthlyCustomerPointTrans[month][el.customerName] =
                monthlyCustomerPointTrans[month][el.customerName] +
                getRewardPointsFromAmount(el.amount);

            totalCustomerPointTrans[el.customerName] =
                totalCustomerPointTrans[el.customerName] +
                getRewardPointsFromAmount(el.amount);
        });

        setMonthlyCustomerPointTrans(monthlyCustomerPointTrans);
        setTotalCustomerPointTrans(totalCustomerPointTrans);
    };

    return (
        <div className='m-5'>
            <div className='d-flex flex-column align-items-center justify-content-between '>
                <div className='card shadow-lg p-3 mb-5 bg-body rounded' style = {{minHeight :'60vh' , maxHeight: '60vh'}}>
                    <h1>Monthly Customer Rewards</h1>
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            {Object.keys(monthlyCustomerPointTrans).map((month, index) => {
                                return <button className={`nav-link ${index === 0 && 'active'}`} data-bs-toggle="tab"
                                               data-bs-target={`#nav-${index + 1}`} type="button" role="tab"
                                               aria-selected="false">{month}
                                </button>

                            })}
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        {Object.keys(monthlyCustomerPointTrans).map((month, index) => {
                            return <div className={`tab-pane fade show ${index === 0 && 'active'}`}
                                        id={`nav-${index + 1}`}
                                        role="tabpanel" aria-labelledby="nav-1-tab"
                                        style={{width: "60vw"}}>

                                <table className="table table-responsive">
                                    <thead>
                                    <tr>
                                        <th scope="col">Customer</th>
                                        <th scope="col">Reward</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {Object.keys(monthlyCustomerPointTrans[month]).map(
                                        (customerName) => (
                                            <tr>
                                                <td>{customerName}</td>
                                                <td>
                                                    {monthlyCustomerPointTrans[month][customerName]}
                                                </td>

                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        })}
                    </div>
                </div>

                <div className='mt-2 card shadow-lg p-3 mb-5 bg-body rounded'>
                    <h1>Total Customer Rewards</h1>
                    <div style={{width: "60vw"}}>
                        <table className="table table-responsive">
                            <thead>
                            <tr>
                                <th scope="col">Customer</th>
                                <th scope="col">Reward</th>
                            </tr>
                            </thead>
                            <tbody>

                            {Object.keys(totalCustomerPointTrans).map((customerName) => (
                                <tr>
                                    <td>{customerName}</td>
                                    <td>{totalCustomerPointTrans[customerName]}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
        </div>
    );
};
