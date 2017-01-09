# qingyuanjie

```bash
git clone https://github.com/jibenziliao/qingyuanjie.git
```

```bash
npm install
```

```bash
react-native link
```

### Android

#### 注意事项
* 如下图所示,如果你的Google Play Service版本比较新,你需要更改第三方插件(react-native-maps)
中的一些参数
![Alt text](./img/Google_Play_Services.png)

在node_modules/react-native-maps/Android目录下,修改build.gradle文件中的dependences为如下内容:
![Alt text](./img/build.gradle.png)

```bash
dependencies {
   compile 'com.facebook.react:react-native:+'
-  compile "com.google.android.gms:play-services-base:9.0.4"
-  compile 'com.google.android.gms:play-services-maps:9.0.4'
+  compile "com.google.android.gms:play-services-base:10.0.1"
+  compile 'com.google.android.gms:play-services-maps:10.0.1'
}
```


```bash
react-native run-android
```
### iOS

```bash
react-native run-ios
```
