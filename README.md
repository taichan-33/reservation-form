予約システムの設定手順
このリポジトリは、Googleカレンダーと連携した予約システムのテンプレートです。以下の手順に従って、店舗に合わせたカスタマイズを行ってください。

1. code.gsの編集
```var calendarId = 'Your calender ID';のYour calender ID```
GoogleカレンダーIDに書き換えてください。


以下のコードの時間を、店舗の営業時間に合わせて書き換えてください。

```startTime.setHours(11, 0, 0);
var endTime = new Date(date);
endTime.setHours(20, 0, 0);
```

以下のコードは、終日予約の場合に予約枠をブロックします。定休日などに利用してください。

```// 終日予約をチェックする
events.forEach(function(event) {
  if (event.isAllDayEvent()) {
    isAllDayBooked = true;
    return;
  }
  bookedTimes.push({ start: event.getStartTime(), end: event.getEndTime() });
});

// 終日予約がある場合、全ての時間帯をブロックする
if (isAllDayBooked) {
  return [];
```

```var allTimes = ['11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'];```
の時間帯を、店舗の営業時間に応じて修正してください。


function sendEmailToAdmin(formData)関数内の以下の部分を、メールアドレスとお店名に書き換えてください。

```var adminEmail = "Your E-mail";
var subject = "Your shop nameの予約が確定しました";
var message = "以下、予約内容です。\nご確認ください\n\n";
message += "【予約店舗】"+"Your shop name"+"\n";
```


function sendEmail(form)関数内の以下の部分を、店舗情報に書き換えてください。

```'【 ご予約店舗 】 Your shop name\n' +
'●お問合せ\n' +
'　名称：Your company name\n' +
'　住所：Your company address \n' +
'　TEL：Your Tell number \n' +
'　E-Mail：Your E-mail\n' +
'　営業時間：Your business hour\n' +
'------------------------------------------------------------------\n' +
'以上がご予約内容控えとなります。\n' +
'ご予約いただきありがとうございます。\n\n' +
'※ご予約のキャンセルは\n' +
'Reservation cancellation form\nよりご連絡をお願いいたします。\n\n' +
'ご来店を心よりお待ちしております。\n' +
'\n' +
'★Your company name★\n' +
'your company homepage\n' +
'';
```

'※ご予約のキャンセルは\n' + 'Reservation cancellation form\nよりご連絡をお願いいたします。\n\n'
の部分は、taichan-33/reservation cancell formで作成したURLに書き換えてください。

最後にGAS編集画面でサービスに「gmail」と「calender」APIを追加してください。


2. app.htmlの編集
```<h1 class="form-title">Your shop name予約フォーム</h1>```
のYour shop nameを、お店名に書き換えてください。

```<option value="プランA">プランA</option><option value="プランB">プランB</option><option value="プランC">プランC</option><option value="プランD">プランD</option>```
の部分を、お客様の店舗で提供するサービスに書き換えてください。

```var company = 'Your shop name';のYour shop name```
を、お店名に書き換えてください。（279行目）

```confirmationMessage.innerHTML = '<h2>' + company + 'Your shop name<br>予約が確定しました</h2>' +のYour shop name```

を、お店名に書き換えてください。
以上の手順に従って、店舗に合わせたカスタマイズを行ってください。
