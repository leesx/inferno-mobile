import {Component, linkEvent} from "inferno";
import {HashRouter, Route, Switch} from "inferno-router";
import "../registerServiceWorker";
import {ActivityIndicator} from "antd-mobile";
import {myAxios} from "./../helpers";
import classNames  from 'classnames';

class HomeList extends Component {
    state = {
        refreshing     : false,
        animating      : false,
        down           : true,
        page           : 'list',
        scrollBoxHeight: document.documentElement.clientHeight,
        clientWidth    : document.documentElement.clientWidth,
        listData       : [],
        detailData     : [],

    }

    componentWillMount() {
        const {pathname} = this.props.location;
        this.showPage(pathname);
    }

    componentDidMount() {
        //const h = this.state.height - findDOMNode(this.pullBoxDom).offsetTop;
        this.setState({
            animating      : true,
            scrollBoxHeight: document.documentElement.clientHeight - 46
        })
        myAxios.get('/shop/reports/waitingQueueList').then(res => {
            if (res.code === '000') {
                this.setState({
                    listData: res.data || [],
                    //height  : h,
                })
            }
        }).finally(() => {
            this.setState({
                animating: false
            })
        })
    }

    componentWillReceiveProps(nextProps, nextState) {
        const {pathname} = nextProps.location;
        this.showPage(pathname);
    }

    showPage = (path) => {
        this.setState({
            page: path === '/' ? 'list' : 'detail'
        })
    }

    onRefreshPage = () => {
        this.setState({refreshing: true});

        myAxios.get('/shop/reports/waitingQueueList').then(res => {
            if (res.code === '000') {
                this.setState({
                    listData: res.data,
                })
            }
        }).finally(() => {
            this.setState({refreshing: false});
        });
    }

    handleClickRow = (shopID) => {
        this.props.history.push(`/detail/${shopID}`);
        this.setState({
            active: true
        })
        myAxios.get('/shop/reports/waitingQueueDetail', {
            params: {shopID}
        }).then(res => {
            if (res.code === '000') {
                this.setState({
                    detailData: res.data,
                })
            }
        })
    }
    setPageDisplay = (page) => {
        return {
            display: this.state.page === page ? 'block' : 'none'
        }
    }

    render() {
        const {detailData, listData, animating, scrollBoxHeight, clientWidth,page} = this.state;
        const bgCls = classNames({
            container:true,
            containerBg:process.env.NODE_ENV === 'development'
        })
        return (
            <div className={bgCls}>
                <div className="list-view-box" style={this.setPageDisplay('list')}>
                    <div className="list-view-header" key="hd">
                        <span>店铺名称</span>
                        <span>当前等待桌数</span>
                    </div>
                    {/*<PullToRefresh
                     ref={el => this.pullBoxDom = el}
                     key="pullbox"
                     style={{
                     height  : this.state.height,
                     overflow: 'auto',
                     }}
                     indicator={{deactivate: '上拉刷新'}}
                     direction='up'
                     refreshing={this.state.refreshing}
                     //onRefresh={this.onRefreshPage}
                     >

                     </PullToRefresh>*/}
                    <div className="scroll-box" style={{height: scrollBoxHeight}}>
                        <div className="list-inner">
                            {listData.map((item, index) => (
                                <div className="item-row" onClick={linkEvent(item.shopID, this.handleClickRow)}>
                                    <span>{item.shopName}</span>
                                    <span>{item.waitingQueueNo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{
                    opacity  : page === 'detail' ? 1 : 0,
                    transform: page === 'detail' ? 'translateX(0)' : 'translateX(' + clientWidth + 'px)'
                }}
                     className="slide-box"
                >
                    <Detail detailData={detailData}/>
                </div>
                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={animating}
                />
            </div>
        );
    }
}

const Detail = ({detailData = []}) => {
    return (
        <div className="desk-detail">
            <h4 className="title">{detailData.shopName}</h4>
            <div className="desk-info">
                <div className="hd">
                    <span>桌台类型</span>
                    <span>当前等待桌数</span>
                </div>
                {
                    detailData.itemList && detailData.itemList.length > 0 && detailData.itemList.map((item, index) => {
                        return (
                            <div className="ds-item" key={`ds_${index}`}>
                                <span>{`${item.tableTypeName}${item.tableType}`}</span>
                                <span className="num">{item.waitingQueueNo}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" component={HomeList}/>
                <Route path="/detail/:id" component={Detail}/>
            </Switch>
        </HashRouter>
    )
};

export default App;
