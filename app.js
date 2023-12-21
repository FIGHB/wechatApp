App({
    globalData:{
        _typeDict: { // 不同页面和图片导航
            "00AA55": ["/images/00AA55.svg", "/pages/publicfan/publicfan"],
            "01AA55": ["/images/01AA55.svg", "/pages/publicheater/publicheater"],
        },
        _connected: false,   // 是否已连接设备
        _deviceIndex:-1,    // 连接的设备在 _devices 中的下标
        _devices: [
            // {
            //     deviceId: 1,
            //     name: "name1",
            //     type: "00AA55",
            //     serviceId: null,
            //     characteristicWriteId:null,
            //     characteristicNotifyId: null
            // },
        ]
    },
})