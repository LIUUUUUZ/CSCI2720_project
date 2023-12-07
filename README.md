# CSCI2720_project
This is the group project for course CSCI2720

The group members are:

Wang Yitian

Song Yifei

Zheng Yuxuan

Liu ZhiXian

## 前端所需的接口如下：

### User

以下内容在未说明时默认的错误返回值均为```res.status(500).json({ error: 'Internal Server Error' });```

1. 进入时加载主页的location列表  
req:
```
get('/location-list')
```  
res:
```
[
  {
    ID: 这个地点的ID,
    info: {
      locationName: 这个地点的名称,
      latitude,
      longitude,
      eventNum: 这个地点的Event数目,
      rate: 评分,
      rateNum： 评分人数
    }
  },
  ...
]
```

2. 进入某个地点页面时  
req:
```
get('/location-page/:locationID')
```  
res:
```
{
  location: {
    ID: 这个地点的ID,
    events: [
      {
        ID: 这个event的ID,
        time: 所需格式为'YYYY/MM/DD XX:XX',
        description,
        presenter,
        price
      },
      ...
    ],
    info: {
      locationName: 这个地点的名称,
      latitude,
      longitude,
      eventNum: 这个地点的Event数目,
      rate: 评分,
      rateNum： 评分人数
    }
  },
  comments: [
    {
      text,
      userName,
      ID
    },
    ...
  ]
}
```

3. 加入收藏时  
req:
```
post('/api/add-favorite', {
  userName,
  locationID
})
```  
res:
```
{
  favoriteVenueID: [1, 2, 3, ...]
}
```

4. 发布评论时
req:
```
post('/api/add-comment', {
  locationID,
  userName,  
  text
})
```  
res: （和2.进入某个地点页面时返回的对象中comments的值是同一个东西）
```
[
  {
    text,
    userName,
    ID
  },
  ...
]
```

### Non-user

1. 登录成功和注册（登录和注册的req相同，登录成功的res和注册的res也相同；不明确具体要求，暂定为此）  
req:
```
post('/api/login', {
  userName,
  password
})
```  
res:
```
{
  userName,
  isAdmin: 一个boolean,
  favoriteVenueID: [1, 2, 3, ...]
}
```

登录失败的res:  
密码错误
```
res.status(401).json({ message: 'Authentication failed. Please try again.' });
```
用户不存在
```
res.status(401).json({ message: 'No user credential found. Please sign up.' });
```

### Admin

这部分涉及mongoDB，实话说我暂时不会搞，如何分工或许可以商议一下……