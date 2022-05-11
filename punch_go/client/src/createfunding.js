import React, { Component } from "react";
import {Link} from "react-router-dom";
import ReactDOM from 'react-dom';
import getWeb3 from "./getWeb3";
import punchingContract from "./contracts/punching.json";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
class createpunching extends  React.Component {

    constructor(props){
        super(props)
        this.state={
            Name:"",
            Amount:0,
            deadline:"",
            overview:""
        }
        this.handleChange=this.handleChange.bind(this);
        this.up=this.up.bind(this);
    }
    handleChange(event){
        // 读取输入的值
        const name=event.target.name;
        const value=event.target.value;
        //   更新状态
        this.setState({
            [name]:value
        })
    }
    async up(){
        if (this.state.Name === "" || this.state.Amount === "" || this.state.deadline === "" || this.state.overview === ""){
            alert('Please fill in every blanks in the form!')
        }
        else{
            let timestamp = new Date(this.state.deadline).getTime();
            console.log(timestamp);
            let a=(new Date()).toLocaleDateString();//获取当前日期
            a =a.replace(/\//g,'-');
            let current_date= (new Date(a));//把当前日期变成时间戳
            console.log(current_date)
            if(current_date - timestamp >= 0){
                alert('Please select valid deadline!')
            }
            else{
                let amount = web3.utils.toWei(this.state.Amount, 'ether')
                console.log(amount)
                let accounts = await web3.eth.getAccounts()
                await punchingInstance.methods.createpunching(accounts[0], this.state.Name, this.state.overview, amount, timestamp).send({
                    from: accounts[0]
                })
                alert('Congratulations, punch is initiated successfully!')
            }
        }
    }
    render() {
        return (
            <div id="wrapper">

                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    <a className="sidebar-brand d-flex align-items-center justify-content-center">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"/>
                        </div>
                        <div className="sidebar-brand-text mx-3">Punch Go </div>
                    </a>

                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider my-0">*/}

                    {/*// <!-- Nav Item - Dashboard -->*/}
                    <li className="nav-item">
                        <Link className="nav-link" to='/home'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>Home</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/allpunchings'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>All Punches</span></Link>
                    </li>
                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider">*/}

                    <li className="nav-item active">
                        <Link className="nav-link" to='/createpunching'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>Initiate a Punch</span></Link>
                    </li>

                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider">*/}

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                           aria-expanded="true" aria-controls="collapseTwo">
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>My Punches</span>
                        </a>
                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">My Punches:</h6>
                                <Link className="collapse-item" to="/my_launch_punchings">Punches Initiated</Link>
                                <Link className="collapse-item" to="/my_joined_punchings">Punches Participated</Link>
                            </div>
                        </div>
                    </li>

                </ul>

                <div className="card o-hidden border-0 shadow-lg my-5 col-10">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-2 d-none d-lg-block"/>
                            <div className="col-lg-8">
                                <div className="p-5" id="user">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Initiate a Punch</h1>
                                    </div>
                                    <form className="user">
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input type="text" className="form-control form-control-user" name="Name" placeholder="Activity Name" value={this.state.Name} onChange={this.handleChange}/>
                                            </div>
                                            <div className="col-sm-6">
                                                <input type="number" min="0" className="form-control form-control-user" name="Amount" placeholder="Activity Deposit" value={this.state.Amount} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Activity Deadline</label>
                                            <input type="date" className="form-control form-control-user" name="deadline" value={this.state.deadline} onChange={this.handleChange}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="name">Activity Description</label>
                                            <textarea className="form-control" rows="5" name="overview" value={this.state.overview} onChange={this.handleChange}/>
                                        </div>
                                        <a className="btn btn-primary btn-user btn-block" type='submit' onClick={this.up}>
                                            Confirm
                                        </a>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default createpunching;