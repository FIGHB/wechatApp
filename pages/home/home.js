// pages/index/index.js
var app=getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        typeDict: {
            "00AA55": ["/images/00AA55.svg", "/pages/publicfan/publicfan"],
            "01AA55": ["/images/01AA55.svg", "/pages/publicheater/publicheater"],
        },
        devices:[],
    },
    f_add_device:function () {
        wx.navigateTo({
          url: '/pages/bluetooth/bluetooth',
        })
    },
    f_creat_connect: function(e) {
        var that = this
        var dataset = e.currentTarget.dataset
        var deviceId = dataset.deviceId
        var deviceType = dataset.deviceType
        console.log("deviceId to creat connect: ", deviceId)
        wx.closeBluetoothAdapter()
        wx.openBluetoothAdapter({ // 开启蓝牙适配器
            success: (res) => {
                console.log('openBluetoothAdapter-success-res: ', res)
                wx.createBLEConnection({
                    deviceId,
                    success: (res) => {
                        app.globalData._connected = true;
                        app.globalData._deviceId = deviceId;
                        wx.navigateTo({
                          url: that.data.typeDict[deviceType][1],
                        })
                    }
                })
            },
            fail(res) {
                console.log('openBluetoothAdapter-fail-res: ', res)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            devices: app.globalData._devices
          });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            devices: app.globalData._devices
          });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})