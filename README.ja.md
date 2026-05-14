# web-push for Deno

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

Deno用のweb-pushライブラリ

## なぜ

Webプッシュでは、バックエンドからトリガーされるプッシュメッセージは、[Web Push Protocol](https://tools.ietf.org/html/draft-ietf-webpush-protocol)を介して送信する必要があります。また、プッシュメッセージと共にデータを送信したい場合、そのデータは[Message Encryption for Web Push spec](https://tools.ietf.org/html/draft-ietf-webpush-encryption)に従って暗号化する必要があります。

このモジュールはメッセージの送信を簡単にし、GCMに依存しているブラウザのレガシーサポートも処理します。

## 使い方

このライブラリの一般的な使用例は、GCM APIキーとVAPIDキーを使用するアプリケーションサーバーです。

```javascript
import webpush from "https://code4fukui.github.io/web-push/src/index.js";

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: '.....',
  keys: {
    auth: '.....',
    p256dh: '.....'
  }
};

webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
````

## applicationServerKey に VAPID キーを使用する

プッシュメッセージの購読時に、VAPID キーを渡す必要があります。  
以下のように行います：

```javascript
registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: '<Your Public Key from generateVAPIDKeys()>'
});
` ``

## コマンドライン (未実装)

グローバルに `web-push` をインストールして、通知を送信したり VAPID キーを生成したりできます。

インストール方法は以下の通りです:

    npm install web-push -g

その後、以下のコマンドを実行できます:

    使用方法:

      web-push send-notification --endpoint=<url> [--key=<browser key>] [--auth=<auth secret>] [--payload=<message>] [--encoding=<aesgcm | aes128gcm>] [--ttl=<seconds>] [--vapid-subject=<vapid subject>] [--vapid-pubkey=<public key url base64>] [--vapid-pvtkey=<private key url base64>] [--proxy=<http proxy uri>] [--gcm-api-key=<api key>]

      web-push generate-vapid-keys [--json]

通知送信の例:
```shell
    > web-push generate-vapid-keys --json
    > {"publicKey":"BGtkbcjrO12YMoDuq2sCQeHlu47uPx3SHTgFKZFYiBW8Qr0D9vgyZSZPdw6_4ZFEI9Snk1VEAj2qTYI1I1YxBXE","privateKey":"I0_d0vnesxbBSUmlDdOKibGo6vEXRO-Vu88QlSlm5j0"}
```
サブスクリプション値:
```javascript
    { 
      "endpoint": "https://fcm.googleapis.com/fcm/send/d61c5u920dw:APA91bEmnw8utjDYCqSRplFMVCzQMg9e5XxpYajvh37mv2QIlISdasBFLbFca9ZZ4Uqcya0ck-SP84YJUEnWsVr3mwYfaDB7vGtsDQuEpfDdcIqOX_wrCRkBW2NDWRZ9qUz9hSgtI3sY", 
      "expirationTime": null, 
      "keys": { 
        "p256dh": "BL7ELU24fJTAlH5Kyl8N6BDCac8u8li_U5PIwG963MOvdYs9s7LSzj8x_7v7RFdLZ9Eap50PiiyF5K0TDAis7t0", 
        "auth": "juarI8x__VnHvsOgfeAPHg" 
      } 
    }
```
コマンドの例:
```shell
    web-push send-notification  \
    --endpoint=https://fcm.googleapis.com/fcm/send/d61c5u920dw:APA91bEmnw8utjDYCqSRplFMVCzQMg9e5XxpYajvh37mv2QIlISdasBFLbFca9ZZ4Uqcya0ck-SP84YJUEnWsVr3mwYfaDB7vGtsDQuEpfDdcIqOX_wrCRkBW2NDWRZ9qUz9hSgtI3sY \
    --key=BL7ELU24fJTAlH5Kyl8N6BDCac8u8li_U5PIwG963MOvdYs9s7LSzj8x_7v7RFdLZ9Eap50PiiyF5K0TDAis7t0 \
    --auth=juarI8x__VnHvsOgfeAPHg \
    --vapid-subject=mailto:example@qq.com \
    --vapid-pubkey=BGtkbcjrO12YMoDuq2sCQeHlu47uPx3SHTgFKZFYiBW8Qr0D9vgyZSZPdw6_4ZFEI9Snk1VEAj2qTYI1I1YxBXE \
    --vapid-pvtkey=I0_d0vnesxbBSUmlDdOKibGo6vEXRO-Vu88QlSlm5j0 \
    --payload=Hello
```  

# API リファレンス

## sendNotification(pushSubscription, payload, options)

```javascript
const pushSubscription = {
  endpoint: '< Push Subscription URL >',
  keys: {
    p256dh: '< User Public Encryption Key >',
    auth: '< User Auth Secret >'
  }
};

const payload = '< Push Payload String >';

const options = {
  gcmAPIKey: '< GCM API Key >',
  vapidDetails: {
    subject: '< \'mailto\' Address or URL >',
    publicKey: '< URL Safe Base64 Encoded Public Key >',
    privateKey: '< URL Safe Base64 Encoded Private Key >'
  },
  timeout: <Number>
  TTL: <Number>,
  headers: {
    '< header name >': '< header value >'
  },
  contentEncoding: '< Encoding type, e.g.: aesgcm or aes128gcm >',
  urgency:'< Default is "normal" >',
  topic:'< Use a maximum of 32 characters from the URL or filename-safe Base64 characters sets. >',

  proxy: '< proxy server options >',
  agent: '< https.Agent instance >'
}

webpush.sendNotification(
  pushSubscription,
  payload,
  options
);
```

> **注意:** `sendNotification()` ではペイロードを定義する必要はありません。また、プッシュサービスがサポートしている場合、GCM API Key および/または VAPID キーなしでもこのメソッドは動作します。

### 入力

**プッシュサブスクリプション**

最初の引数はプッシュサブスクリプションの詳細を含むオブジェクトでなければなりません。

期待されるフォーマットは、ブラウザ内の PushSubscription を JSON.stringify した際の出力と同じです。

**ペイロード**

ペイロードはオプショナルですが、設定されている場合、プッシュメッセージに送信されるデータとなります。

これは *文字列* または node の [*Buffer*](https://nodejs.org/api/buffer.html) でなければなりません。

> **注意:** *ペイロード* を暗号化するには、*pushSubscription* に *p256dh* と *auth* 値を含む *keys* オブジェクトが **必須** です。

**オプション**

オプションは定義されていない場合を除けば、以下のいずれかの値を含むオブジェクトでなければなりません。ただし、これらはすべて必須ではありません。

- **gcmAPIKey** はこのリクエスト専用の GCM API キーを指定できます。これは `setGCMAPIKey()` で設定された API キーを上書きします。
- **vapidDetails** は *subject*, *publicKey*, *privateKey* 値を含むオブジェクトでなければなりません。これらの値は [VAPID Spec](https://tools.ietf.org/html/draft-thomson-webpush-vapid) に従う必要があります。
- **timeout** はミリ秒単位でリクエストのソケットタイムアウトを指定します。タイムアウトが発生すると、リクエストは破棄され、意味のあるエラーとともにプロミスが拒否されます。ソケットタイムアウトが完全なレスポンス受信のタイムアウトであるという誤解が一般的ですが、たとえばソケットタイムアウトが1秒で、レスポンスが3つのTCPパケットに分かれており、それぞれ0.9秒で到着する場合、合計2.7秒かかってもタイムアウトは発生しません。ソケットタイムアウトがトリガーされると、リクエストはライブラリによって中止されます（デフォルトは未定義）。
- **TTL** は秒単位でプッシュメッセージがプッシュサービスによって保持される期間を指定します（デフォルトは4週間）。
- **headers** はリクエストに追加したいすべての追加ヘッダーを含むオブジェクトです。
- **contentEncoding** は使用するプッシュエンコーディングの種類を指定します（例: 'aes128gcm' がデフォルト、または 'aesgcm'）。
- **urgency** はプッシュサービスに対して通知を即時に送信するか、受信者のデバイスの電力考慮を優先するかを示します。以下のいずれかの値を指定してください: very-low, low, normal, high。通知を即時に配信しようとする場合は high を指定してください。
- **topic** はオプションで、プッシュサービスが通知を統合するために使用する識別子を指定できます。URL またはファイル名に安全な Base64 文字セットから最大32文字を使用してください。
- **proxy** は [HttpsProxyAgent のコンストラクタ引数](https://github.com/TooTallNate/node-https-proxy-agent#new-httpsproxyagentobject-options) で、プロキシサーバーの文字列URI（例: http://< hostname >:< port >）またはより具体的なプロパティを持つ"options"オブジェクトのいずれかです。
- **agent** は [HTTPS Agent インスタンス](https://nodejs.org/dist/latest/docs/api/https.html#https_class_https_agent) で、`https.request` メソッドで使用されます。`proxy` オプションが定義されている場合、`agent` は無視されます！

> **注意:** 現在のところ、プッシュ通知リクエストに VAPID `subject` として `https://localhost` URI を参照するものが含まれている場合（`options` 引数またはグローバルの `setVapidDetails()` メソッドを使用して設定されている場合）、Safari のプッシュ通知エンドポイントが `BadJwtToken` エラーでリクエストを拒否します。

### 戻り値

通知が正常に送信された場合、リクエストの詳細とともに解決されるプロミスを返します。それ以外の場合は拒否されます。

解決または拒否のどちらの場合でも、返されたオブジェクトまたはエラーにアクセスして以下の値を取得できます。

- *statusCode*, プッシュサービスからのレスポンスのステータスコード;
- *headers*, プッシュサービスからのレスポンスのヘッダー;
- *body*, プッシュサービスからのレスポンスの本文。

<hr />

## generateVAPIDKeys()

```javascript
const vapidKeys = webpush.generateVAPIDKeys();

// Prints 2 URL Safe Base64 Encoded Strings
console.log(vapidKeys.publicKey, vapidKeys.privateKey);
```

### 入力

ありません。

### 戻り値

**publicKey** と **privateKey** の値を持つオブジェクトを返します。これらは
URL Safe Base64エンコードされた文字列です。

> **注意:** これらのキーは一度だけ生成し、保存して今後送信するすべてのメッセージで使用する必要があります。

<hr />

## setGCMAPIKey(apiKey)

```javascript
webpush.setGCMAPIKey('Your GCM API Key');
```

### 入力

このメソッドは、ウェブアプリのマニフェスト内の `gcm_sender_id` にリンクされたGCM APIキーを期待します。

Google Developer Console または Firebase プロジェクトの *Cloud Messaging* タブからGCM APIキーを使用できます。

### 戻り値

なし。

<hr />

## setVapidDetails(subject, publicKey, privateKey)

```javascript
webpush.setVapidDetails(
  'mailto:user@example.org',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
```

`sendNotification()` および `generateRequestDetails()` への後続の呼び出しで、明示的にオプションで上書きされない限り、アプリケーションの VAPID サブジェクト、公開鍵、秘密鍵をグローバルに設定します。

### 入力

`setVapidDetails` メソッドは以下の入力を期待します：

- *subject*: VAPID サーバーの連絡先情報。`https:` または `mailto:` URI ([VAPID 規格に従う](https://datatracker.ietf.org/doc/html/draft-thomson-webpush-vapid#section-2.1))。
- *publicKey*: VAPID 公開鍵。
- *privateKey*: VAPID 秘密鍵。

### 戻り値

なし。

<hr />

## encrypt(userPublicKey, userAuth, payload, contentEncoding)

```javascript
const pushSubscription = {
  endpoint: 'https://....',
  keys: {
    p256dh: '.....',
    auth: '.....'
  }
};
webPush.encrypt(
  pushSubscription.keys.p256dh,
  pushSubscription.keys.auth,
  'My Payload',
  'aes128gcm'
)
.then(encryptionDetails => {

});
```

Web Pushのメッセージ暗号化に関する[Message Encryption for Web Push](https://webpush-wg.github.io/webpush-encryption/)仕様に基づいてペイロードを暗号化します。

> (*sendNotification*は自動でペイロードを暗号化するため、*sendNotification*を使用する場合は手動で暗号化する必要はありません)。

### 入力

`encrypt()`メソッドは以下の入力を期待します:

- *userPublicKey*: 受信者の公開鍵 (ブラウザから取得)
- *userAuth*: 受信者の認証シークレット (ブラウザから取得)
- *payload*: 通知に添付するメッセージ
- *contentEncoding*: 使用するコンテンツエンコーディングの種類 (例: aesgcm または aes128gcm)

### 戻り値

このメソッドは以下のフィールドを持つオブジェクトを返します:

- *localPublicKey*: 暗号化時に使用された秘密鍵に対応する公開鍵
- *salt*: ペイロードを暗号化するために使用されたsaltを表す文字列
- *cipherText*: 暗号化されたペイロードを含むBuffer

<hr />

## getVapidHeaders(audience, subject, publicKey, privateKey, contentEncoding, expiration)

```javascript
const parsedUrl = url.parse(subscription.endpoint);
const audience = parsedUrl.protocol + '//' +
  parsedUrl.hostname;

const vapidHeaders = vapidHelper.getVapidHeaders(
  audience,
  'mailto: example@web-push-node.org',
  vapidDetails.publicKey,
  vapidDetails.privateKey,
  'aes128gcm'
);
```

*getVapidHeaders()* メソッドは、AuthorizationヘッダーとCrypto-Keyヘッダーを作成するために必要な値を受け取ります。

### 入力

`getVapidHeaders()` メソッドは以下の入力を期待します:

- *audience*: **プッシュサービス**のオリジン。
- *subject*: アプリケーションのmailtoまたはURL。
- *publicKey*: VAPID公開鍵。
- *privateKey*: VAPID秘密鍵。
- *contentEncoding*: 使用するコンテンツエンコーディングの種類（例: aesgcmまたはaes128gcm）。

### 戻り値

このメソッドは以下のフィールドを持つオブジェクトを返します:

- *localPublicKey*: 暗号化時に使用された秘密鍵と一致する公開鍵。
- *salt*: ペイロードを暗号化するために使用されたsaltを表す文字列。
- *cipherText*: Bufferとしての暗号化されたペイロード。

<hr />

## generateRequestDetails(pushSubscription, payload, options)

```javascript
const pushSubscription = {
  endpoint: '< Push Subscription URL >';
  keys: {
    p256dh: '< User Public Encryption Key >',
    auth: '< User Auth Secret >'
  }
};

const payload = '< Push Payload String >';

const options = {
  gcmAPIKey: '< GCM API Key >',
  vapidDetails: {
    subject: '< \'mailto\' Address or URL >',
    publicKey: '< URL Safe Base64 Encoded Public Key >',
    privateKey: '< URL Safe Base64 Encoded Private Key >',
  }
  TTL: <Number>,
  headers: {
    '< header name >': '< header value >'
  },
  contentEncoding: '< Encoding type, e.g.: aesgcm or aes128gcm >',
  urgency:'< Default is normal "Defult" >',
  topic:'< Use a maximum of 32 characters from the URL or filename-safe Base64 characters sets. >',
  proxy: '< proxy server options >'
}

try {
  const details = webpush.generateRequestDetails(
    pushSubscription,
    payload,
    options
  );
} catch (err) {
  console.error(err);
}
```

> **注意:** `generateRequestDetails()` を呼び出す際、payload 引数は定義する必要はありません。null を渡すと、本文が含まれず、不要なヘッダーも除外されます。
> GCM API Key および/または VAPID キーに関連するヘッダーは、指定され且つ必要とされる場合に含まれます。

### 入力

**Push Subscription**

最初の引数は、プッシュサブスクリプションの詳細を含むオブジェクトでなければなりません。

期待される形式は、ブラウザ内の PushSubscription を JSON.stringify した出力と同じです。

**Payload**

payload はオプショナルですが、設定されている場合、暗号化され、`payload` パラメーターを通じて [*Buffer*](https://nodejs.org/api/buffer.html) が返されます。

この引数は *string* または node [*Buffer*](https://nodejs.org/api/buffer.html) のいずれかでなければなりません。

> **注意:** *payload* を暗号化するには、*pushSubscription* に *keys* オブジェクトが含まれ、*p256dh* と *auth* 値が必要です。

**Options**

Options はオプショナルな引数で、定義されている場合、以下のいずれかの値を含むオブジェクトでなければなりません。ただし、これらはすべて必須ではありません。

- **gcmAPIKey** はこのリクエスト専用の GCM API キーを指定できます。これは `setGCMAPIKey()` で設定された API キーを上書きします。
- **vapidDetails** は *subject*、*publicKey*、*privateKey* 値を含むオブジェクトでなければなりません。これらの値は [VAPID Spec](https://tools.ietf.org/html/draft-thomson-webpush-vapid) に従う必要があります。
- **TTL** はプッシュメッセージがプッシュサービスによって保持される秒数を指定します（デフォルトは4週間）。
- **headers** はリクエストに追加したいすべての追加ヘッダーを含むオブジェクトです。
- **contentEncoding** は使用するプッシュエンコーディングの種類を指定します（例: 'aesgcm' がデフォルト、または 'aes128gcm'）。
- **urgency** はプッシュサービスに通知を即時に送信するか、受信者のデバイスの電力状況を優先して配信するかを示します。以下のいずれかの値を指定してください: very-low、low、normal、high。通知を即時に配信するには high を指定します。
- **topic** はオプションで、プッシュサービスが通知を統合するために使用する識別子を指定できます。URL またはファイル名に安全な Base64 文字セットから最大32文字を使用してください。
- **proxy** は [HttpsProxyAgent のコンストラクタ引数](https://github.com/TooTallNate/node-https-proxy-agent#new-httpsproxyagentobject-options) で、プロキシサーバーの文字列 URI（例: http://< hostname >:< port >）またはより具体的なプロパティを持つ "options" オブジェクトのいずれかです。

### 戻り値

ネットワークリクエストを行うために必要なすべての詳細を含むオブジェクトが返されます。オブジェクトには以下が含まれます:

- *endpoint*、リクエストを送信する URL;
- *method*、これは 'POST' になります;
- *headers*、リクエストに追加するヘッダー;
- *body*、リクエストの本文（Node Buffer として）。

<hr />

# ブラウザサポート

<table>
<thead>
<tr>
<th><strong>ブラウザ</strong></th>
<th width="130px"><strong>ペイロードなしのプッシュ</strong></th>
<th width="130px"><strong>ペイロードありのプッシュ</strong></th>
<th width="130px"><strong>VAPID</strong></th>
<th><strong>メモ</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Chrome</td>

<!-- Push without payloads support-->
<td>✓ v42+</td>

<!-- Push with payload support -->
<td>✓ v50+</td>

<!-- VAPID Support -->
<td>✓ v52+</td>

<td>v51 以下では、プッシュサブスクリプションを取得するために `gcm_sender_id` が必要です。</td>
</tr>

<tr>
<td>Edge</td>

<!-- Push without payloads support-->
<td>✓ v17+ (2018年4月)</td>

<!-- Push with payload support -->
<td>✓ v17+ (2018年4月)</td>

<!-- VAPID Support -->
<td>✓ v17+ (2018年4月)</td>

<td></td>
</tr>

<tr>
<td>Firefox</td>

<!-- Push without payloads support-->
<td>✓ v44+</td>

<!-- Push with payload support -->
<td>✓ v44+</td>

<!-- VAPID Support -->
<td>✓ v46+</td>

<td></td>
</tr>

<tr>
<td>Opera</td>

<!-- Push without payloads support-->
<td>✓ v39+ <strong>*</strong></td>

<!-- Push with payload support -->
<td>✓ v39+ <strong>*</strong></td>

<!-- VAPID Support -->
<td>✗</td>

<td>
  <strong>*</strong> Opera は Android でのみプッシュをサポートし、デスクトップではサポートしていません。
  <br />
  <br />
  プッシュサブスクリプションを取得するために `gcm_sender_id` が必要です。
</td>
</tr>

<tr>
<td>Safari</td>

<!-- Push without payloads support-->
<td>✓ v16+ </td>

<!-- Push with payload support -->
<td>✓ v16+</td>

<!-- VAPID Support -->
<td>✓ v16+</td>

<td>macOS 13 以降の Safari 16</td>
</tr>

<tr>
<td>サムスンインターネットブラウザ</td>

<!-- Push without payloads support-->
<td>✓ v4.0.10-53+</td>

<!-- Push with payload support -->
<td>✓ v5.0.30-40+</td>

<!-- VAPID Support -->
<td>✗</td>

<td>プッシュサブスクリプションを取得するために `gcm_sender_id` が必要です。</td>
</tr>
</tbody>
</table>

# ヘルプ

**MDN**

[MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Re-engageable_Notifications_Push) には例があります。

また、[Service Worker Cookbook](https://github.com/mdn/serviceworker-cookbook) にはこのライブラリを使用した Web Push の例がたくさんあります。

# テストの実行

> 必須条件:
>  * Java JDK または JRE (http://www.oracle.com/technetwork/java/javase/downloads/index.html)

テストを実行するには:

    npm test

<p align="center">
  <a href="https://www.npmjs.com/package/web-push">
    <img src="https://nodei.co/npm/web-push.svg?downloads=true" />
  </a>
</p>
