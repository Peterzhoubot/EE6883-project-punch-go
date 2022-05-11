import React, { Component } from "react";
import {Link} from "react-router-dom";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
let project = {}
let state = ''
let ddl = ''
class punching_detail extends  React.Component {
    constructor() {
        super();
        this.state={
            accounts: '',
            money:0
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
    componentWillMount = async () => {
        project = {} //清空数组
        //获取当前的所有地址
        project = await punchingInstance.methods.allpunchings(this.props.match.params.id).call()
        project.usedMoney = web3.utils.fromWei(project.usedMoney, 'ether')
        project.goalMoney = web3.utils.fromWei(project.goalMoney, 'ether');
        project.raisedMoney = web3.utils.fromWei(project.raisedMoney, 'ether')
        console.log(project)
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            state = "Finished"
        }
        else{
            if(ddl - current_time >= 0){
                state = "Ongoing"
            }
            else{
                state = "Expired"
            }
        }
        ddl = (new Date(parseInt(ddl))).toLocaleDateString()
        let accounts = await web3.eth.getAccounts()
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    async up(){
        if (this.state.money === 0){
            alert('Amount must be larger than 0!')
        }
        else{
            if(this.state.money > (project.goalMoney - project.raisedMoney)){
                alert('You can deposit no more than' + (project.goalMoney - project.raisedMoney) + "eth")
            }
            else{
                await punchingInstance.methods.contribute(this.props.match.params.id).send({
                    from: this.state.accounts[0],
                    value: web3.utils.toWei(this.state.money, 'ether')
                })
                alert('Thank you for your participating!')
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
                    <li className="nav-item active">
                        <Link className="nav-link" to='/allpunchings'>
                            <i className="fas fa-fw fa-tachometer-alt"/>
                            <span>All Punches</span></Link>
                    </li>
                    {/*<!-- Divider -->*/}
                    {/*<hr className="sidebar-divider">*/}

                    <li className="nav-item">
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

                <div id="content-wrapper" className="d-flex flex-column">


                    <div id="content">

                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">


                            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                <i className="fa fa-bars"/>
                            </button>

                            <form
                                className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                           placeholder="Search Punches"
                                           aria-label="Search" aria-describedby="basic-addon2"/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"/>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <ul className="navbar-nav ml-auto">

                                <li className="nav-item dropdown no-arrow d-sm-none">
                                    <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-search fa-fw"/>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                         aria-labelledby="searchDropdown">
                                        <form className="form-inline mr-auto w-100 navbar-search">
                                            <div className="input-group">
                                                <input type="text" className="form-control bg-light border-0 small"
                                                       placeholder="Search for..." aria-label="Search"
                                                       aria-describedby="basic-addon2"/>
                                                <div className="input-group-append">
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="fas fa-search fa-sm"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </li>


                                <li className="nav-item dropdown no-arrow">
                                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                                Current Account Address：{this.state.accounts[0]}</span>
                                        <img className="img-profile rounded-circle"
                                             src="img/undraw_profile.svg"/>
                                    </a>
                                </li>

                            </ul>

                        </nav>

                        <div class="container-fluid">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">Activity Details</h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive" class="row">
                                        <div class="col-lg-12">
                                            <div className="card mb-4 py-3 border-left-success">
                                                <div className="card-body">
                                                    <h5>Activity Initiator：<strong>{project.initiator}</strong></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div className="card mb-4 py-3 border-left-primary">
                                                <div className="card-body">
                                                    <h5>Activity Name：<strong>{project.title}</strong><span className="badge badge-info ml-3">Activity Deadline：{ddl}</span></h5>
                                                </div>
                                            </div>
                                            <div className="card mb-4 py-3 border-left-secondary">
                                                <div className="card-body">
                                                    <h5>Activity Status：<strong>{state}</strong></h5>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-lg-6">
                                            <div className="card mb-4 py-3 border-left-info">
                                                <div className="card-body">
                                                    <h5>Activity Deposit：<strong>{project.goalMoney}eth</strong></h5>
                                                </div>
                                            </div>
                                            <div className="card mb-4 py-3 border-left-warning">
                                                <div className="card-body">
                                                    <h5>Current Total Deposit：<strong>{project.raisedMoney}eth</strong></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div className="card mb-4 py-3 border-left-danger">
                                                <div className="card-body">
                                                    <h5>Remaining Participators：<strong>{project.usedMoney}</strong></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div className="card mb-4 py-3 border-left-warning">
                                                <div className="card-body">
                                                    <h5>Number of Participators：<strong>{project.punchersLength}</strong></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div className="card mb-4 py-3 border-left-dark">
                                                <div className="card-body">
                                                    <h5>Activity Description：</h5>
                                                    <p>
                                                        <strong>{project.content}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <a href="#" className="btn btn-success btn-icon-split"  style={{float:"center"}}
                                               data-target="#myModal" data-toggle="modal">
                                                <span className="text">I want to participate</span>
                                            </a>
                                            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog"
                                                 aria-labelledby="myModalLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h4 className="modal-title" id="myModalLabel">
                                                                请输入投资金额
                                                            </h4>
                                                            <button type="button" className="close" data-dismiss="modal"
                                                                    aria-hidden="true">
                                                                &times;
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <input type="number" min="0" className="form-control form-control-user" name="money" value={this.state.money} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-default"
                                                                    data-dismiss="modal">Close
                                                            </button>
                                                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.up}>
                                                                Confirm participating
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default punching_detail;