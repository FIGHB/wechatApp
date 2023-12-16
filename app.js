App({
    globalData:{
        _connected: false,   // 是否创建链接
        _deviceId:null,
        _service: {},
        _characteristics: [],
        _characteristics_write_index: -1,   // _characteristics中具有写功能的特征ID
        _devices: [
            {
                deviceId: 3,
                name: "name1",
                type: "heater"
            },
            {
                deviceId: 1,
                name: "name1",
                type: "fan"
            },
            {
                deviceId: 2,
                name: 'name2',
                type: "fan"
            },
            {
                deviceId: 3,
                name: "name1",
                type: "heater"
            },
            {
                deviceId: 1,
                name: "name1",
                type: "fan"
            },
            {
                deviceId: 2,
                name: 'name222222222222222',
                type: "fan"
            }
        ]
    },
})