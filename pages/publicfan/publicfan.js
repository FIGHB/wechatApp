// pages/publicfan/publicfan.js
var bluetooth = require('../bluetooth/bluetooth.js')
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        service: {},
        characteristics: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var deviceId = decodeURIComponent(options.deviceId);
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
        var that = this
        this.setData({
            deviceId: app.globalData._deviceId,
            service: app.globalData._service,
            characteristics: app.globalData._characteristics
        })
        console.log("app.globalData.services: ", app.globalData._services)
        this.data.characteristics.forEach(item => {
            if (item.properties.notify) {
                wx.notifyBLECharacteristicValueChange({
                    deviceId: this.data.deviceId,
                    serviceId: this.data.service.uuid,
                    characteristicId: item.uuid,
                    state: true,
                    success(res) {
                        console.log("notify: ", res)
                    }
                })
            }
        });
        wx.onBLECharacteristicValueChange(function (res) {
            console.log('onBLECharacteristicValueChange', res)
            console.log('onBLECharacteristicValueChange', bluetooth.ab2hex(res.value))
        })
    },
    writeBLECharacteristicValue(e) {
        if(app.globalData._characteristics_write_index === -1) {
            app.globalData._characteristics.forEach((item, index) => {
                if(item.properties.write) {
                    app.globalData._characteristics_write_index = index;
                }
            })
        }
        var str = e.currentTarget.dataset['uart']
        str = str.trim()
        console.log("uart: ", str)
        var array = str.split(' ').map(item => parseInt(item, 16))
        var buffer = new ArrayBuffer(array.length)
        let dataView = new DataView(buffer)
        array.forEach((item, index) => {
            dataView.setUint8(index, item)
        })
        console.log(app.globalData._deviceId, app.globalData._service.uuid, app.globalData._characteristics)

        wx.writeBLECharacteristicValue({
          deviceId: app.globalData._deviceId,
          serviceId: app.globalData._service.uuid,
          characteristicId: app.globalData._characteristics[app.globalData._characteristics_write_index].uuid,
          value: buffer,
        })
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