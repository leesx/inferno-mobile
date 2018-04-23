import {Component,linkEvent} from "inferno";
import {findDOMNode} from "inferno-compat";
import {HashRouter, Route, Switch} from "inferno-router";
import "../registerServiceWorker";
import {PullToRefresh,Toast} from "antd-mobile";

import {myAxios} from './../helpers';

let num = 0;
function genData() {
    const dataArr = [];
    for (let i = 0; i < 20; i++) {
        dataArr.push({
            shopName: '肯德基' + i,
            num     : i,
            shopID  : i,
        });
    }
    return dataArr;
};



class HomeList extends Component {
    state = {
        refreshing: false,
        down      : true,
        page      : 'list',
        detail    : {},
        height    : document.documentElement.clientHeight,
        data      : [],
    }

    componentWillMount(){
        console.log(this.props,'.......')
        this.setState({
            page: this.props.location.pathname === '/' ? 'list' : 'detail'
        })
    }

    componentDidMount() {
        console.log(num++)
        myAxios.post('http://baidu.com').then(res => console.log(res))
        const h = this.state.height - findDOMNode(this.pullBoxDom).offsetTop;
        setTimeout(() => this.setState({
            height: h,
            data  : genData(),
        }), 0);
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log(nextProps)
        this.setState({
            page: nextProps.location.pathname === '/' ? 'list' : 'detail'
        })
    }

    handleClickRow = (shopID) => {
        console.log(this.props)
        this.props.history.push(`/detail/${shopID}`)
        setTimeout(() => this.setState({
            detail: {
                shopID,
                name: 'test' + shopID
            }
        }), 0);
    }
    setPageDisplay = (page) => {
        return {
            display: this.state.page === page ? 'block' : 'none'
        }
    }

    render() {
        const {detail} = this.state
        return (
            <div className="layout">
                <div className="list-view-box" style={this.setPageDisplay('list')}>
                    <div className="list-view-header" key="hd">
                        <span>店铺名称</span>
                        <span>当前等待桌数</span>
                    </div>
                    <PullToRefresh
                        ref={el => this.pullBoxDom = el}
                        key="pullbox"
                        style={{
                            height  : this.state.height,
                            overflow: 'auto',
                        }}
                        indicator={{deactivate: '上拉刷新'}}
                        direction='up'
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({refreshing: true});
                            setTimeout(() => {
                                console.log('refresh')
                                this.setState({refreshing: false});
                            }, 1000);
                        }}
                    >
                        {this.state.data.map((item, index) => (
                            <div className="item-row" onClick={linkEvent(item.shopID,this.handleClickRow)}>
                                <span>{item.shopName}</span>
                                <span>{item.num}</span>
                            </div>
                        ))}
                    </PullToRefresh>
                </div>
                <div style={this.setPageDisplay('detail')}>
                    <Detail detail={detail}/>
                </div>
            </div>
        );
    }
}

const Detail = ({detail}) => {

    return (
        <div className="desk-detail">
            <h4 className="title">西直门店{detail.shopID}</h4>
            <div className="desk-info">
                <div className="hd">
                    <span>桌台类型</span>
                    <span>当前等待桌数</span>
                </div>
                <div className="ds-item">
                    <span>大桌</span>
                    <span className="num">10</span>
                </div>
                <div className="ds-item">
                    <span>大桌</span>
                    <span className="num">10</span>
                </div>
                <div className="ds-item">
                    <span>大桌</span>
                    <span className="num">10</span>
                </div>
            </div>
        </div>
    )
}

class App extends Component {

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" component={HomeList}/>
                    <Route path="/detail/:id" component={Detail}/>
                </Switch>
            </HashRouter>
        )
    }
}

export default App;
