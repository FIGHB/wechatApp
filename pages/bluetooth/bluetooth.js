// pages/odd/index.js
const app = getApp()

function inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i;
        }
    }
    return -1;
}

function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2) // 截取最后两个
        }
    )
    return hexArr.join('');
}



Page({
    /**
     * 页面的初始数据
     */
    data: {
        device_arr: [],
        deviceId: null,
        name: null
    },
    f_creatConnect(e) {
        var dataset = e.currentTarget.dataset
        var deviceId = dataset.deviceId
        var name = dataset.name
        wx.createBLEConnection({
            deviceId,
            success: (res) => {
                this.setData({
                    connected: true,
                    deviceId: deviceId,
                    name: name
                })
                wx.stopBluetoothDevicesDiscovery()
                app.globalData._devices.push({
                    id: deviceId,
                    name: name,
                    type: "fan"
                })
                app.globalData._connected = true;
                app.globalData._deviceId = deviceId;
                this.f_getBLEDeviceServices(deviceId)
            }
        })
    },
    f_getBLEDeviceServices(deviceId) {
        wx.getBLEDeviceServices({
            deviceId: app.globalData._deviceId,
            success: (res) => {
                // console.log('res.services.length: ', res.services.length)
                for (let i = 0; i < res.services.length; i++) {
                    // console.log("PrimaryId: ", res.services[i].uuid)
                    if (res.services[i].isPrimary && res.services[i].uuid.includes('AE20')) {
                        var service = res.services[i]
                        wx.getBLEDeviceCharacteristics({
                            deviceId: deviceId,
                            serviceId: res.services[i].uuid,
                            success(res) {
                                app.globalData._service = service
                                app.globalData._characteristics = res.characteristics
                                // console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                                // console.log('res.characteristics[0].uuid:', res.characteristics[0].uuid)
                                // console.log('res.characteristics[0].properties.read:', res.characteristics[0].properties.read)
                                // console.log('res.characteristics[0].properties.write:', res.characteristics[0].properties.write)
                                wx.redirectTo({
                                    url: '/pages/publicfan/publicfan?deviceId=' + deviceId,
                                })
                            }
                        })
                    }
                }
            },
            fail: (res) => {
                console.log("getBLEDeviceServices: ", res)
            }
        })
    },
    f_openBluetoothAdapter() {
        var that = this
        wx.openBluetoothAdapter({ // 开启蓝牙适配器
            success: (res) => {
                console.log('openBluetoothAdapter-success-res: ', res)
                this.f_startBluetoothDevicesDiscovery()
                console.log("success (res): ", this)
            },
            fail(res) {
                console.log('openBluetoothAdapter-fail-res: ', res)
            }
        })
    },
    f_startBluetoothDevicesDiscovery() {
        var that = this
        wx.startBluetoothDevicesDiscovery({
            services: ['AF30'],
            success(res) {
                that.f_onBluetoothDeviceFound()
            },
            fail(res) {
                console.log('f_startBluetoothDevicesDiscovery-fail: ' + res)
            },
            complete(res) {
                console.log('f_startBluetoothDevicesDiscovery-complete: ' + res)
            }
        })
    },
    f_onBluetoothDeviceFound() {
        var that = this
        wx.onBluetoothDeviceFound((res) => {
            res.devices.forEach((device) => {
                if (!device.name && !device.localName) {
                    return
                }
                const hex_bytes = ab2hex(device.advertisData)
                console.log("hex_bytes: ", hex_bytes)
                const foundDevices = that.data.device_arr
                const everConnected = inArray(app.globalData._devices, 'deviceId', device.deviceId)
                if (everConnected === -1) {
                    const idx = inArray(foundDevices, 'deviceId', device.deviceId)
                    const data = {}
                    if (idx === -1) {
                        data[`device_arr[${foundDevices.length}]`] = device
                    } else {
                        data[`device_arr[${idx}]`] = device
                    }
                    console.log("data: ", data)
                    that.setData(data)
                }
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("bluetooth onLoad")
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("bluetooth onShow")
        if (app.globalData._connected) {
            wx.closeBLEConnection({
                deviceId: app.globalData._deviceId,
                success(res) {
                    console.log("bluetooth close successed: ", res)
                }
            })
            wx.closeBluetoothAdapter({
                success(res) {
                    console.log("success close BluetoothAdapter: ", res)
                }
            })
            app.globalData._connected = false;
        }
        this.f_openBluetoothAdapter();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log("bluetooth onReady")
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        console.log("bluetooth onHide")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        console.log("bluetooth onUnload")
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

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


module.exports.inArray = inArray
module.exports.ab2hex = ab2hex