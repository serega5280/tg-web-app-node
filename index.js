const TelegramBot = require('node-telegram-bot-api');
const webAppUrl = 'https://frabjous-parfait-05649a.netlify.app'

const express = require('express')
const cors = require('cors')

// replace the value below with the Telegram token you receive from @BotFather
const token = '5814458771:AAFELFalYe29V9CnJRvwh2qND_fuqhdQrNE'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message',async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появиться кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Ниже появиться кнопка, заполни форму', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

  if (msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg?.web_app_data?.data)

        await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
        await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country)
        await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street)

        setTimeout( async () => {
            await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате.')
        }, 3000)
    }
    catch (e) {
        console.log(e)
    }
  }
});

app.post('/web-data', (req, res) => {
    const {queryId, products, totalPrice} = req.body

    try {
        bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {message_text: 'Поздравляю с покупкой!'}
        })
        return res.status(200).json({})
    }
    catch (e) {
        bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Неудалось приобрести товар',
            input_message_content: {message_text: 'Неудалось приобрести товар'}
        })
        return res.status(500).json({})
    }
})

const PORT = 8000

app.listen(PORT, () => console.log('server started on PORT ' + PORT))