/* WeTypecho-微信小程序版Typecho
   使用教程：www.2012.pro
   有任何使用问题请联系作者QQ 294351525
*/
var API = require('../utils/api');
var Tips = require('../utils/tips');
var Net = require('../utils/net');

import { $stopWuxRefresher, $stopWuxLoader } from '../dist/wux/index'

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
module.exports = {
  /**
   * 页面名称
   */
  // name: "index",
  /**
   * 页面的初始数据
   */
  data: {
    postslist: [],
    swipelist: [],
    topswiper: 'none',
    midposts: 'none',
    indexAllcatslist: [],
    allcatpostlist: [],
    current_cat: 0,
    current_position: 'mid_99999999',
    postheight: '0',
    scrollTop: 0,
  },
  onPageScroll(e){
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  onRefresh(){
    console.log('refresh')
    $stopWuxRefresher()
  },
  onLoadmore(){
    console.log('loadmore')
    $stopWuxLoader()
  },
  fetchposts() {
    var that = this;
    Net.request({
      url: API.GetSwiperPost(),
      success: function (res) {
        var datas = res.data.data;
        if (API.IsNull(datas)) {
          that.setData({
            topswiper: 'block',
            swipelist: datas.map(function (ori_item) {
              var item = API.ParseItem(ori_item);
              return item;
            })
          })
        }
      }
    })
  },
  fetchallcats() {
    var that = this;
    Net.request({
      url: API.GetCat(),
      success: function (res) {
        console.log(res)
        var datas = res.data.data;
        datas = datas.map(function (item) {
          item.id_tag = "mid_" + item.mid;
          return item;
        });

        that.setData({
          indexAllcatslist: datas
        })

        // that.data.allcatpostlist = datas.map(function (item) {
        //   return null;
        // });
        // if (that.data.allcatslist.length > 0) {
        //   that.changeCatex(that.data.allcatslist[0].mid);
        // }
        // that.setData({
        //   allcatslist: that.data.allcatslist
        // })
      }
    })
  },
  // getmidindex(mid) {
  //   for (var i = 0; i < this.data.allcatslist.length; i++)
  //     if (mid == this.data.allcatslist[i].mid) {
  //       return i;
  //     }
  // },
  fetchpostbymid(mid = 99999999) {
    var that = this;
    // var idx = this.getmidindex(mid);

    Net.request({
      url: API.GetPostsbyMID(mid),
      success: function (res) {
        var datas = res.data.data;
        console.log(res)
          that.setData({
            allcatpostlist: datas,
          })

      }
    })
  },
  // change_finish(e) {
  //   var that = this;
  //   if (e.detail.current != this.data.current_cat) {
  //     this.changeCatex(this.data.allcatslist[e.detail.current].mid);
  //     this.setData({
  //       current_cat: e.detail.current,
  //       current_position: that.data.allcatslist[e.detail.current].id_tag
  //     })

  //   }
  // },
  // changeCat(e) {
  //   this.data.current_cat_mid = e.target.dataset.mid;
  //   var idx = this.getmidindex(this.data.current_cat_mid);
  //   if (idx != this.data.current_cat) {
  //     this.setData({
  //       current_cat: idx
  //     })
  //     this.changeCatex(this.data.current_cat_mid);
  //   }
  // },
  // changeCatex(mid) {
  //   this.setData({
  //     catpostlist: []
  //   })
  //   this.data.allcatslist = this.data.allcatslist.map(function (item) {
  //     if (item.mid == mid)
  //       item.active = true;
  //     else
  //       item.active = false;
  //     return item;
  //   })
  //   this.setData({
  //     allcatslist: this.data.allcatslist
  //   })
  //   this.fetchpostbymid(mid);
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.getUserInfo({
      success: function (res) {
        app.Data.userInfo = res.userInfo;
        wx.login({
          success: function (res) {
            app.Data.userInfo.code = res.code;
            //Login
            Net.request({
              url: API.Login(app.Data.userInfo),
              success: function (res) {
                var datas = res.data.data;
                app.Data.userInfo.openid = datas;
              },
              fail: function () {}
            })
          }
        })
      }
    });
    this.fetchposts();
    this.fetchallcats();
    this.fetchpostbymid()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onIndexRefresh() {
    this.setData({
      swipelist: [],
      postslist: [],
      midposts: 'none',
      topswiper: 'none',
      current_cat: 0,
      current_position: 'mid_99999999'
    })
    this.onLoad();
  },

}