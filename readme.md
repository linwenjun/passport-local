## 一个最简单的授权验证

### 运行 
   ```
   npm init
   npm start
   ```

### 说明
1.  可用postman测试，
2.  POST /login
```
# header
Content-Type: application/x-www-form-urlencoded 
# body
username: admin
password: pass
```

2. GET /users 只要登录即可访问
3. GET /data 不仅要登录，还需要配置role和uri的关系，详细看配置项 roleURIMap