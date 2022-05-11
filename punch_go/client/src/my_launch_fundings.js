import React, { Component } from "react";
import {Link} from "react-router-dom";
let punchingInstance = require('./eth/punching')
let web3 = require('./utils/InitWeb3');
let project = {}
let projects = []
let ddl = ''
let style = ''
let state = ''
let indexes = []
class my_launch_punchings extends  React.Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }
    Is_complete_style(id){
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            style = "badge badge-info ml-3"
        }
        else{
            if(ddl - current_time >= 0){
                style = "badge badge-warning ml-3"
            }
            else{
                style = "badge badge-secondary ml-3"
            }
        }
        return style
    }
    Is_complete(id){
        project = projects[id]
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
        return state
    }
    componentWillMount = async () => {
        projects = [] //清空数组
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let projects_number = await punchingInstance.methods.allpunchingsLength().call()
        for(let i = 0; i < projects_number; i++){
            let project =await punchingInstance.methods.allpunchings(i).call()
            project.usedMoney = web3.utils.fromWei(project.usedMoney, 'ether')
            project.raisedMoney = web3.utils.fromWei(project.raisedMoney, 'ether')
            if(project.initiator === accounts[0]){
                indexes.push(i)
                projects.push(project)
            }
        }
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
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
                                <Link className="collapse-item active" to="/my_launch_punchings">Punches Initiated</Link>
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

                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-lg-12">
                                    {
                                        (projects.length === 0)
                                            ? null
                                            : projects.map((item, index) => {
                                                return (
                                                    <div className="card mb-4 py-3 border-left-warning">
                                                        <div className="card-body">
                                                            Activity Name： {item.title}
                                                            <span
                                                                className={this.Is_complete_style(index)}>{this.Is_complete(index)}</span>
                                                            <Link className="btn btn-info" style={{float: "right"}}
                                                                  to={{pathname: '/my_launch_punching_detail/' + indexes[index]}}>View Details</Link>
                                                        </div>
                                                    </div>
                                                )
                                            }, this)
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default my_launch_punchings;