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
    var hexArr = Array.prototype.map.call(  // 对原数组中的每个数都调用一边回调函数,然后组成新的数组返回
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2) // 截取最后两个,toString(16)表示转换成16进制,默认十进制
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
    },
    f_creatConnect(e) {
        var dataset = e.currentTarget.dataset
        var index = dataset.index
        var deviceId = this.data.device_arr[index].deviceId
        var name = dataset.name
        var advertisData = ab2hex(this.data.device_arr[index].advertisData).toUpperCase()
        wx.createBLEConnection({
            deviceId,
            success: (res) => {
                wx.stopBluetoothDevicesDiscovery()
                app.globalData._connected = true;
                this.f_getBLEDeviceServices(deviceId, name, advertisData)
            }
        })
    },
    f_getBLEDeviceServices(deviceId, name, advertisData) {
        wx.getBLEDeviceServices({
            deviceId: deviceId,
            success: (res) => {
                for (let i = 0; i < res.services.length; i++) {
                    if (res.services[i].isPrimary && res.services[i].uuid.includes('AE20')) {
                        var serviceId = res.services[i].uuid
                        this.f_getBLEDeviceCharacteristics(deviceId, serviceId, name, advertisData)
                    }
                }
            },
            fail: (res) => {
                console.log("getBLEDeviceServices: ", res)
            }
        })
    },
    f_getBLEDeviceCharacteristics(deviceId, serviceId, name, advertisData) {
        wx.getBLEDeviceCharacteristics({
            deviceId: deviceId,
            serviceId: serviceId,
            success(res) {
                var characteristicWriteId = null;
                var characteristicNotifyId = null;
                res.characteristics.forEach(item => {
                    if (item.properties.notify) {
                        characteristicNotifyId = item.uuid
                    }else if(item.properties.write) {
                        characteristicWriteId = item.uuid
                    }
                })
                if(characteristicWriteId && characteristicNotifyId) {
                    app.globalData._devices.unshift({   // 将元素添加到数组开头
                        deviceId: deviceId,
                        serviceId: serviceId,
                        name: name,
                        type: advertisData,
                        characteristicWriteId: characteristicWriteId,
                        characteristicNotifyId: characteristicNotifyId
                    })
                    app.globalData._deviceIndex = 0;
                    wx.redirectTo({
                        url: '/pages/publicfan/publicfan',
                    })
                }

            }
        })
    },
    f_openBluetoothAdapter() {
        var that = this
        wx.closeBluetoothAdapter()
        wx.openBluetoothAdapter({ // 开启蓝牙适配器
            success: (res) => {
                console.log('openBluetoothAdapter-success-res: ', res)
                app.globalData._isBluetoothAdapter = true
                this.f_startBluetoothDevicesDiscovery()
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
                const advertisData = ab2hex(device.advertisData)
                console.log("advertisData: ", advertisData)
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
                    app.globalData._connected = false
                }
            })
            wx.closeBluetoothAdapter({
                success(res) {
                    console.log("success close BluetoothAdapter: ", res)
                }
            })
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