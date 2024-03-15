// Replace 'your-calendar-id' with the ID of the calendar you want to use
var calendarId = 'Your calender ID';
var calendar = CalendarApp.getCalendarById(calendarId);

function doGet() {
  return HtmlService.createTemplateFromFile('app.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getAvailableTimes(date) {
    var startTime = new Date(date);
    startTime.setHours(11, 0, 0);
    var endTime = new Date(date);
    endTime.setHours(20, 0, 0);

    var events = calendar.getEvents(startTime, endTime);
    var bookedTimes = [];
    var isAllDayBooked = false;

    // 終日予約をチェックする
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
    }

    var now = new Date();
    now.setHours(now.getHours() + 15);

    var allTimes = ['11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'];

    var availableTimes = allTimes.filter(function(timeSlot) {
        var timeStart = new Date(date + ' ' + timeSlot.split('-')[0]);
        var timeEnd = new Date(date + ' ' + timeSlot.split('-')[1]);

        var isAvailable = bookedTimes.every(function(bookedTime) {
            return timeEnd <= bookedTime.start || timeStart >= bookedTime.end;
        });

        return isAvailable && timeStart >= now;
    });

    return availableTimes;
}

function storeFormData(data) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'name': data.name,
    'phone': data.phone,
    'email': data.email,
    'reservationType': data.reservationType,
    'reservationDate': data.reservationDate,
    'reservationTime': data.reservationTime,
    'remarks': data.remarks
  });
}

function getStoredFormData() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return {
    'name': scriptProperties.getProperty('name'),
    'phone': scriptProperties.getProperty('phone'),
    'email': scriptProperties.getProperty('email'),
    'reservationType': scriptProperties.getProperty('reservationType'),
    'reservationDate': scriptProperties.getProperty('reservationDate'),
    'reservationTime': scriptProperties.getProperty('reservationTime'),
    'remarks': scriptProperties.getProperty('remarks')
  };
}

function submitForm(form) {
  var reservationType = form.reservationType;
  var reservationDate = new Date(form.reservationDate);
  var reservationTime = form.reservationTime.split('-');
  var startTime = new Date(reservationDate);
    startTime.setHours(reservationTime[0].split(':')[0], reservationTime[0].split(':')[1], 0);
  var endTime = new Date(reservationDate);
  endTime.setHours(reservationTime[1].split(':')[0], reservationTime[1].split(':')[1], 0);

  var event = calendar.createEvent(reservationType + ': ' + form.name, startTime, endTime);
  event.setDescription('電話番号: ' + form.phone + '\nメールアドレス: ' + form.email + '\n備考: ' + form.remarks);
  
  // メールを送信
  sendEmail(form);
  sendEmailToAdmin(form); // 管理者へのメール送信を追加
}

function sendEmailToAdmin(formData) {
  var adminEmail = "Your E-mail";
  var subject = "Your shop nameの予約が確定しました";
  var message = "以下、予約内容です。\nご確認ください\n\n";
  message += "【予約店舗】"+"Your shop name"+"\n";
  message += "【お名前】 " + formData.name + "\n";
  message += "【電話番号】 " + formData.phone + "\n";
  message += "【メールアドレス】 " + formData.email + "\n";
  message += "【予約内容】 " + formData.reservationType + "\n";
  message += "予約日: " + formData.reservationDate + "\n";
  message += "予約時間: " + formData.reservationTime + "\n";
  message += "備考: " + formData.remarks + "\n";
  message += "\n";
  message += "カレンダーイベントに予約が追加されています。\n";
   message += "予約を確認してください。\n";
  GmailApp.sendEmail(adminEmail, subject, message);
}

function sendEmail(form) {
  // 現在の日時を取得し、お問い合わせ番号に変換
  var now = new Date();
  var inquiryNumber = '' + now.getFullYear() + (now.getMonth() + 1).toString().padStart(2, '0') +
                      now.getDate().toString().padStart(2, '0') + now.getHours().toString().padStart(2, '0') +
                      now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');

  
  var subject = 'Your shop name<ご予約内容>';
  var body = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
             'Your shop nameご予約確認の自動返信メールです\n' +
             '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
             'この度はご予約をいただき誠にありがとうございます。\n\n' +
             '※このメールに返信していただいても、予約店舗には届きませんのでご注意ください。\n\n' +
             '【 お問合せ番号 】' + inquiryNumber + '\n' +  // お問い合わせ番号を挿入
             '基本情報-------------------------------------------------------------------\n\n' +
             '【 ご予約の内容 】 ' + form.reservationType + '\n' +
             '【 ご予約店舗 】 Your shop name\n' +
             '【 ご予約日 】 ' + form.reservationDate + '\n' +
             '【 ご予約時間 】 ' + form.reservationTime + '\n'+
             '【 お名前 】 ' + form.name + '\n' +
             '【 メールアドレス 】 ' + form.email + '\n' +
             '【 電話番号 】 ' + form.phone + '\n' +
             '【 お問合せ内容 】\n' +
             form.remarks + '\n\n' +
             '●お問合せ\n' +
             '　名称：Your company name\n' +
             '　住所：Your company address \n' +
             '　TEL：072-947-9399 \n' +
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

GmailApp.sendEmail(form.email, subject, body);
}
