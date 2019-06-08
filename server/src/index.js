const express = require('express')
const http = require('http')
const _ = require('lodash')

const SERVER = {
  HOST: 'localhost',
  PORT: 8082,
}

const NOTIFICATION_TYPES = [
  'like',
  'match',
  'unlike',
  'profile',
]

class Server {
  constructor() {
    // Server variables
    this.app = express()
    this.http = http.Server(this.app)

    // Sockets handler
    this.io = require('socket.io')(this.http, { pingTimeout: 60000 }) // eslint-disable-line
    this.correlationTable = {}
    this.io.sockets.on('connection', (socket) => {
      // Add correlation UserId - SocketId when login event is triggered
      socket.on('loginUser', (uid) => {
        if (!_.isEmpty(uid)) {
          const id = parseInt(uid, 10)
          if (_.isEmpty(this.correlationTable[id])) {
            Object.assign(this.correlationTable, { [id]: [socket.id] })
          } else this.correlationTable[id].push(socket.id)
        }
      })

      // Remove all sockets Id when user logs out
      socket.on('logoutUser', (uid) => {
        if (!_.isEmpty(this.correlationTable[parseInt(uid, 10)])) {
          this.correlationTable[parseInt(uid, 10)].forEach((socketId) => {
            this.io.to(`${socketId}`).emit('logout')
          })
        }
      })

      // Handle notifications
      socket.on('notification', (notification) => {
        if (notification.type && NOTIFICATION_TYPES.indexOf(notification.type) > -1
        && notification.emitter && notification.receiver) {
          const receiver = parseInt(notification.receiver, 10)
          if (this.correlationTable[receiver] !== undefined
          && this.correlationTable[receiver].length) {
            this.correlationTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('notification', {
                data: {
                  type: notification.type,
                  emitter: notification.emitter,
                },
              })
            })
          }
          const emitter = parseInt(notification.emitter, 10)
          if (notification.type === 'like') {
            if (this.correlationTable[emitter] !== undefined
            && this.correlationTable[emitter].length) {
              this.correlationTable[emitter].forEach((socketId) => {
                this.io.to(`${socketId}`).emit('notification', {
                  data: {
                    type: notification.type,
                    emitter: notification.receiver,
                  },
                })
              })
            }
          }
        }
      })

      // Handle if a given user is connected or not
      socket.on('isOnline', (userIds) => {
        const onlineUsers = userIds.map((userId) => {
          const id = parseInt(userId, 10)
          let isOnline = false
          Object.keys(this.correlationTable).forEach((key) => {
            if (parseInt(key, 10) === id && !_.isEmpty(this.correlationTable[key])) isOnline = true
          })
          return { id, isOnline }
        })
        this.io.to(`${socket.id}`).emit('isOnline', { data: { onlineUsers } })
      })

      // Handle chat messages
      socket.on('message', (message) => {
        if (message.emitter && message.receiver && message.content) {
          const receiver = parseInt(message.receiver, 10)
          if (this.correlationTable[receiver]
          && this.correlationTable[receiver].length) {
            this.correlationTable[receiver].forEach((socketId) => {
              this.io.to(`${socketId}`).emit('message', {
                data: {
                  content: message.content,
                  emitter: message.emitter,
                  receiver: message.receiver,
                },
              })
            })
          }
        }
      })

      // [PRESET EVENT] remove socket Id from correlationTable
      socket.on('disconnect', () => {
        const key = _.findKey(this.correlationTable, socketIds => (
          socketIds.indexOf(socket.id) > -1
        ))
        _.remove(this.correlationTable[key], el => el === socket.id)
      })
    })
  }

  listen() {
    this.http.listen(SERVER.PORT, SERVER.HOST, () => {
      console.log(`Listening on http://${SERVER.HOST}:${SERVER.PORT}`)
    })
  }
}

new Server().listen()
