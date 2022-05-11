pragma solidity >=0.4.21 <0.7.0;

contract punching{
    struct punching{
        address payable initiator; //众筹项目发起者
        string title;//标题
        string content;//内容
        uint goalMoney;//目标金额
        uint raisedMoney;//已筹集金额
        uint usedMoney;//已使用金额
        uint deadline;//众筹项目截止日期
        bool isSuccess;//是否筹集成功
        uint punchersLength;//投资人数量
        uint proposalsLength;//申请使用资金的次数
        mapping(uint => puncher) punchers;//投资者
        mapping(uint => Proposal) proposals;//申请使用资金的记录
    }

    // 投资者信息
    struct puncher{
        address payable add; //投资者地址
        uint cost; //投资者的投资金额
    }

    uint public allpunchingsLength;//众筹项目的总数量
    mapping(uint => punching) public allpunchings;//All Punches项目的map


    //申请使用资金的记录
    struct Proposal{
        string content;//申请说明
        uint amount;//Punch Day
        uint agreeAmount;//持Approve态度的投资者的金额之和
        uint disAmount;//持反对态度的投资者的金额之和
        uint goal;//可以转账的最低金额，数值上等于amount的一般
        mapping(uint => uint) states;//该记录的状态
        bool isAgreed;//是否通过
    }
    //投资项目的函数
    function contribute(uint _punchId) public payable {
        require(msg.value>0);
        require(now<=allpunchings[_punchId].deadline);
        punching storage punching = allpunchings[_punchId];
        uint puncherNum = punching.punchersLength + 1;
        punching.punchersLength += 1;
        puncher storage puncher = punching.punchers[puncherNum];
        puncher.add = msg.sender;
        puncher.cost = msg.value;
        punching.raisedMoney += msg.value;
        if(punching.raisedMoney >= punching.goalMoney)punching.isSuccess=true;
    }
    //创建众筹项目的函数
    function createpunching(address payable _initiator, string memory _title, string memory _content, uint _goalMoney, uint _remainingtime) public returns(uint) {
        uint num = allpunchingsLength;
        allpunchingsLength+=1;
        punching storage punching = allpunchings[num];
        punching.initiator = _initiator;
        punching.title = _title;
        punching.content = _content;
        punching.goalMoney = _goalMoney;
        punching.raisedMoney = 0;
        punching.deadline = _remainingtime + now;
        return num;
    }
    

    //创建申请资金的记录
    function createProposal(uint _punchId, string memory _content, uint _amount) public {
        punching storage punching = allpunchings[_punchId];
        require(punching.initiator == msg.sender);
        uint proNum = punching.proposalsLength + 1;
        punching.proposalsLength+=1;
        Proposal storage proposal = punching.proposals[proNum];
        proposal.content = _content;
        proposal.amount = _amount;
        proposal.goal = punching.raisedMoney / 2;
    }
    //审批申请的函数
    function agreeProposal(uint _punchId, uint _proposalId, bool _isAgree) public puncherOfpunching(_punchId){
        punching storage punching = allpunchings[_punchId];
        require(_proposalId>=1 && _punchId<=punching.proposalsLength);
        Proposal storage proposal = punching.proposals[_proposalId];
        for(uint i = 1; i<=punching.punchersLength;i++){
            puncher memory puncher = punching.punchers[i];
            if(puncher.add==msg.sender){
                if(_isAgree){
                    proposal.states[i]=1;
                    proposal.agreeAmount += puncher.cost;
                }
                else{
                    proposal.states[i]=2;
                    proposal.disAmount += puncher.cost;
                }
            }
        }
        if(proposal.agreeAmount >= proposal.goal){
            proposal.isAgreed = true;
            punching.initiator.transfer(proposal.amount);
            punching.usedMoney += proposal.amount;
        }
        else if(proposal.disAmount >=proposal.goal){
            proposal.isAgreed = false;
        }
    }
    //获取的申请记录
    function getProposal(uint _punchId, uint _proposalId) public view returns(string memory, uint, uint, uint, uint, bool) {
        require(_punchId>=0 && _punchId<=allpunchingsLength);
        punching storage punching = allpunchings[_punchId];
        require(_proposalId>=1 && _punchId<=punching.proposalsLength);
        Proposal storage proposal = punching.proposals[_proposalId];
        return (proposal.content, proposal.amount, proposal.agreeAmount, proposal.disAmount, proposal.goal, proposal.isAgreed);
    }
    //获取申请记录的数量
    function getProposalsLength(uint _punchId) public view returns(uint){
        return allpunchings[_punchId].proposalsLength;
    }
    //获取合约地址的剩余资金
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    //make sure the puncher is in this punching
    modifier puncherOfpunching(uint _punchId){
        require(_punchId>=0 && _punchId<=allpunchingsLength);
        punching storage punching = allpunchings[_punchId];
        bool isIn = false;
        for(uint i = 1; i<=punching.punchersLength;i++){
            puncher memory puncher = punching.punchers[i];
            if(puncher.add==msg.sender)
            isIn = true;
        }
        require(isIn == true);
        _;
    }
    
    function getMypunchings(uint _punchId) public view returns(uint){
        uint money=0;
        punching storage punching = allpunchings[_punchId];
        for(uint j=1;j<=punching.punchersLength;j++){
            puncher memory puncher = punching.punchers[j];
            if(puncher.add==msg.sender)
            money+=puncher.cost;
        }
        return money;
    }
    
    function getMyInitpunchings(uint _punchId) public view returns(bool){
        return (allpunchings[_punchId].initiator == msg.sender ? true:false);
    }
}
